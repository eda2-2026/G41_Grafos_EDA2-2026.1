import type { Environment } from './building.types';

export type SimulationIntensity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SimulationStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface SimulationConfig {
  id: string;
  buildingId: string;
  floorId: string;
  originEnvironmentId: string;
  intensity: SimulationIntensity;
  blockedEnvironmentIds: string[];
  blockedConnectionIds: string[];
  createdAt: string;
}

export interface Route {
  type: 'PRIMARY' | 'ALTERNATIVE';
  originEnvironmentId: string;
  path: string[];
  pathNames: string[];
  distanceMeters: number;
  timeSeconds: number;
  peopleCount: number;
  pcdPeopleCount: number;
  exitEnvironmentId: string;
  cost: number;
}

export interface SimulationResult {
  id: string;
  config: SimulationConfig;
  status: SimulationStatus;
  primaryRoutes: Route[];
  alternativeRoutes: Route[];
  inaccessibleEnvironmentIds: string[];
  inaccessiblePcdEnvironmentIds: string[];
  totalPeople: number;
  evacuatedPeople: number;
  estimatedTimeSeconds: number;
  exitsUsedIds: string[];
  coveragePercentage: number;
  executedAt: string;
}

export interface SimulationParams {
  environments: Environment[];
  connections: import('./connection.types').Connection[];
  originEnvironmentId: string;
  intensity: SimulationIntensity;
  blockedEnvironmentIds: string[];
  blockedConnectionIds: string[];
}
