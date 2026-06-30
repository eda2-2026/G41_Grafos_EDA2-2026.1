import type { Graph } from '../Graph';

export interface PathResult {
  path: string[];
  cost: number;
}

interface QueueItem {
  id: string;
  cost: number;
}

export const dijkstra = (graph: Graph, originId: string, exitIds: string[]): PathResult | null => {
  const exits = new Set(exitIds);
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const visited = new Set<string>();
  const queue: QueueItem[] = [{ id: originId, cost: 0 }];

  graph.getEnvironments().forEach((environment) => distances.set(environment.id, Number.POSITIVE_INFINITY));
  distances.set(originId, 0);

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();
    if (!current || visited.has(current.id)) continue;
    visited.add(current.id);

    if (exits.has(current.id)) {
      const path = [current.id];
      let cursor = current.id;
      while (previous.has(cursor)) {
        const parent = previous.get(cursor);
        if (!parent) break;
        path.unshift(parent);
        cursor = parent;
      }
      return { path, cost: current.cost };
    }

    graph.neighbors(current.id).forEach((neighbor) => {
      if (visited.has(neighbor.environmentId)) return;
      const nextCost = current.cost + neighbor.weight;
      if (nextCost < (distances.get(neighbor.environmentId) ?? Number.POSITIVE_INFINITY)) {
        distances.set(neighbor.environmentId, nextCost);
        previous.set(neighbor.environmentId, current.id);
        queue.push({ id: neighbor.environmentId, cost: nextCost });
      }
    });
  }

  return null;
};
