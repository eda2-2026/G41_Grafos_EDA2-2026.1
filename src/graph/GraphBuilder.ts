import type { Connection, Environment, SimulationIntensity } from '@/types';
import { Graph } from './Graph';

interface BuildOptions {
  intensity: SimulationIntensity;
  blockedEnvironmentIds: string[];
  blockedConnectionIds: string[];
  requireAccessible: boolean;
}

export class GraphBuilder {
  static build(environments: Environment[], connections: Connection[], options: BuildOptions): Graph {
    const blockedEnvironmentIds = new Set(options.blockedEnvironmentIds);
    const blockedConnectionIds = new Set(options.blockedConnectionIds);
    const activeEnvironments = environments.filter((env) => !blockedEnvironmentIds.has(env.id));
    const activeEnvironmentIds = new Set(activeEnvironments.map((env) => env.id));
    const activeConnections = connections.filter((connection) => {
      const elevatorBlocked = connection.type === 'ELEVATOR' && (options.intensity === 'HIGH' || options.intensity === 'CRITICAL');
      return (
        !blockedConnectionIds.has(connection.id) &&
        !elevatorBlocked &&
        activeEnvironmentIds.has(connection.fromEnvironmentId) &&
        activeEnvironmentIds.has(connection.toEnvironmentId) &&
        (!options.requireAccessible || connection.isAccessible)
      );
    });

    return new Graph(activeEnvironments, activeConnections, options.intensity, options.requireAccessible);
  }
}
