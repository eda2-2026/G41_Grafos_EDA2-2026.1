import type { Connection, Environment, SimulationIntensity } from '@/types';

export interface WeightedNeighbor {
  environmentId: string;
  connection: Connection;
  weight: number;
}

export class Graph {
  private readonly environments = new Map<string, Environment>();
  private readonly adjacency = new Map<string, WeightedNeighbor[]>();

  constructor(environments: Environment[], connections: Connection[], intensity: SimulationIntensity, requireAccessible: boolean) {
    environments.forEach((environment) => {
      this.environments.set(environment.id, environment);
      this.adjacency.set(environment.id, []);
    });

    connections.forEach((connection) => {
      const weight = Graph.calculateWeight(connection, intensity, requireAccessible);
      this.adjacency.get(connection.fromEnvironmentId)?.push({ environmentId: connection.toEnvironmentId, connection, weight });
      this.adjacency.get(connection.toEnvironmentId)?.push({ environmentId: connection.fromEnvironmentId, connection, weight });
    });
  }

  static calculateWeight(connection: Connection, intensity: SimulationIntensity, requireAccessible: boolean): number {
    const elevatorPenalty = connection.type === 'ELEVATOR' && (intensity === 'HIGH' || intensity === 'CRITICAL') ? 999 : 0;
    const accessibilityPenalty = requireAccessible && !connection.isAccessible ? 500 : 0;
    return connection.distanceMeters * 0.3 + connection.traversalTimeSeconds * 0.4 + connection.riskLevel * 10 * 0.3 + elevatorPenalty + accessibilityPenalty;
  }

  getEnvironment(id: string): Environment | undefined {
    return this.environments.get(id);
  }

  getEnvironments(): Environment[] {
    return [...this.environments.values()];
  }

  neighbors(environmentId: string): WeightedNeighbor[] {
    return this.adjacency.get(environmentId) ?? [];
  }
}
