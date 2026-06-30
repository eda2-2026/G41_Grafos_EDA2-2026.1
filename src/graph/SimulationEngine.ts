import type { Connection, Environment, Route, SimulationParams, SimulationResult } from '@/types';
import { createId } from '@/utils/id';
import { GraphBuilder } from './GraphBuilder';
import { findInaccessibleFromExits } from './algorithms/connectedComponents';
import { dijkstra } from './algorithms/dijkstra';

const sumPeople = (environment: Environment): number => environment.occupancy.regular + environment.occupancy.pcd;

const routeMetrics = (path: string[], connections: Connection[]): { distance: number; time: number } => {
  let distance = 0;
  let time = 0;
  for (let index = 0; index < path.length - 1; index += 1) {
    const from = path[index];
    const to = path[index + 1];
    const connection = connections.find(
      (item) =>
        (item.fromEnvironmentId === from && item.toEnvironmentId === to) ||
        (item.fromEnvironmentId === to && item.toEnvironmentId === from),
    );
    distance += connection?.distanceMeters ?? 0;
    time += connection?.traversalTimeSeconds ?? 0;
  }
  return { distance, time };
};

export class SimulationEngine {
  run(params: SimulationParams): SimulationResult {
    const blockedEnvironmentIds = new Set(params.blockedEnvironmentIds);
    const exits = params.environments
      .filter((env) => env.type === 'EMERGENCY_EXIT' && !blockedEnvironmentIds.has(env.id))
      .map((env) => env.id);
    const byId = new Map(params.environments.map((env) => [env.id, env]));
    const primaryRoutes: Route[] = [];
    const alternativeRoutes: Route[] = [];
    const inaccessibleEnvironmentIds = new Set<string>();
    const inaccessiblePcdEnvironmentIds = new Set<string>();

    params.environments
      .filter((env) => sumPeople(env) > 0 && !blockedEnvironmentIds.has(env.id))
      .forEach((environment) => {
        const graph = GraphBuilder.build(params.environments, params.connections, {
          intensity: params.intensity,
          blockedEnvironmentIds: params.blockedEnvironmentIds,
          blockedConnectionIds: params.blockedConnectionIds,
          requireAccessible: environment.occupancy.pcd > 0,
        });
        const primary = dijkstra(graph, environment.id, exits);
        if (!primary) {
          inaccessibleEnvironmentIds.add(environment.id);
          if (environment.occupancy.pcd > 0) inaccessiblePcdEnvironmentIds.add(environment.id);
          return;
        }

        const metrics = routeMetrics(primary.path, params.connections);
        primaryRoutes.push({
          type: 'PRIMARY',
          originEnvironmentId: environment.id,
          path: primary.path,
          pathNames: primary.path.map((id) => byId.get(id)?.name ?? id),
          distanceMeters: metrics.distance,
          timeSeconds: metrics.time,
          peopleCount: sumPeople(environment),
          pcdPeopleCount: environment.occupancy.pcd,
          exitEnvironmentId: primary.path[primary.path.length - 1],
          cost: primary.cost,
        });

        const primaryConnectionIds = params.connections
          .filter((connection) =>
            primary.path.some((id, index) => {
              const next = primary.path[index + 1];
              return (
                next &&
                ((connection.fromEnvironmentId === id && connection.toEnvironmentId === next) ||
                  (connection.fromEnvironmentId === next && connection.toEnvironmentId === id))
              );
            }),
          )
          .map((connection) => connection.id);
        const alternative = dijkstra(
          GraphBuilder.build(params.environments, params.connections, {
            intensity: params.intensity,
            blockedEnvironmentIds: params.blockedEnvironmentIds,
            blockedConnectionIds: [...params.blockedConnectionIds, ...primaryConnectionIds],
            requireAccessible: environment.occupancy.pcd > 0,
          }),
          environment.id,
          exits,
        );
        if (alternative) {
          const altMetrics = routeMetrics(alternative.path, params.connections);
          alternativeRoutes.push({
            type: 'ALTERNATIVE',
            originEnvironmentId: environment.id,
            path: alternative.path,
            pathNames: alternative.path.map((id) => byId.get(id)?.name ?? id),
            distanceMeters: altMetrics.distance,
            timeSeconds: altMetrics.time,
            peopleCount: sumPeople(environment),
            pcdPeopleCount: environment.occupancy.pcd,
            exitEnvironmentId: alternative.path[alternative.path.length - 1],
            cost: alternative.cost,
          });
        }
      });

    const graphForCoverage = GraphBuilder.build(params.environments, params.connections, {
      intensity: params.intensity,
      blockedEnvironmentIds: params.blockedEnvironmentIds,
      blockedConnectionIds: params.blockedConnectionIds,
      requireAccessible: false,
    });
    findInaccessibleFromExits(graphForCoverage, exits).forEach((id) => inaccessibleEnvironmentIds.add(id));
    params.blockedEnvironmentIds.forEach((id) => inaccessibleEnvironmentIds.add(id));

    const totalPeople = params.environments.reduce((total, env) => total + sumPeople(env), 0);
    const evacuatedPeople = primaryRoutes.reduce((total, route) => total + route.peopleCount, 0);
    const estimatedTimeSeconds = primaryRoutes.reduce((max, route) => Math.max(max, route.timeSeconds), 0);

    return {
      id: createId('sim'),
      config: {
        id: createId('config'),
        buildingId: '',
        floorId: '',
        originEnvironmentId: params.originEnvironmentId,
        intensity: params.intensity,
        blockedEnvironmentIds: params.blockedEnvironmentIds,
        blockedConnectionIds: params.blockedConnectionIds,
        createdAt: new Date().toISOString(),
      },
      status: 'COMPLETED',
      primaryRoutes,
      alternativeRoutes,
      inaccessibleEnvironmentIds: [...inaccessibleEnvironmentIds],
      inaccessiblePcdEnvironmentIds: [...inaccessiblePcdEnvironmentIds],
      totalPeople,
      evacuatedPeople,
      estimatedTimeSeconds,
      exitsUsedIds: [...new Set(primaryRoutes.map((route) => route.exitEnvironmentId))],
      coveragePercentage: totalPeople === 0 ? 100 : Math.round((evacuatedPeople / totalPeople) * 100),
      executedAt: new Date().toISOString(),
    };
  }
}
