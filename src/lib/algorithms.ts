import type { Edge, Node } from '../types';

// --- Helper: Priority Queue ---
class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): { element: T; priority: number } | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// --- Helper: Check existence ---
export const vertexExists = (nodes: Node[], vertexId: string): boolean => {
  return nodes.some(n => n.id === vertexId);
};

// --- 1. BFS ---
export const bfs = (edges: Edge[], startNode: string, isDirected: boolean): string[] => {
  const adjacency: Record<string, string[]> = {};

  // Build Adjacency List
  edges.forEach(e => {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;

    if (!adjacency[s]) adjacency[s] = [];
    adjacency[s].push(t);

    if (!isDirected) {
      if (!adjacency[t]) adjacency[t] = [];
      adjacency[t].push(s);
    }
  });

  const visited = new Set<string>();
  const queue = [startNode];
  const result: string[] = [];

  while (queue.length > 0) {
    const node = queue.shift()!;
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      const neighbors = adjacency[node] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
  }
  return result;
};

// --- 2. DFS ---
export const dfs = (edges: Edge[], startNode: string, isDirected: boolean): string[] => {
  const adjacency: Record<string, string[]> = {};

  edges.forEach(e => {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;

    if (!adjacency[s]) adjacency[s] = [];
    adjacency[s].push(t);

    if (!isDirected) {
      if (!adjacency[t]) adjacency[t] = [];
      adjacency[t].push(s);
    }
  });

  const visited = new Set<string>();
  const result: string[] = [];

  const visit = (node: string) => {
    if (visited.has(node)) return;
    visited.add(node);
    result.push(node);
    const neighbors = adjacency[node] || [];
    for (const neighbor of neighbors) visit(neighbor);
  };

  visit(startNode);
  return result;
};

// --- 3. Dijkstra ---
// Returns structured data: { [nodeId]: { distance: number, path: string[] } }
export const dijkstra = (edges: Edge[], startNode: string, nodes: Node[], isDirected: boolean) => {
  const adjacency: Record<string, { target: string, weight: number }[]> = {};

  // Initialize graph with empty arrays for all nodes (handles isolated nodes)
  nodes.forEach(n => adjacency[n.id] = []);

  edges.forEach(e => {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;
    const w = e.weight || 1;

    adjacency[s].push({ target: t, weight: w });
    if (!isDirected) adjacency[t].push({ target: s, weight: w });
  });

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const pq = new PriorityQueue<string>();

  nodes.forEach(n => {
    distances[n.id] = Infinity;
    previous[n.id] = null;
  });

  distances[startNode] = 0;
  pq.enqueue(startNode, 0);

  while (!pq.isEmpty()) {
    const item = pq.dequeue();
    if (!item) break;
    const { element: u } = item;

    const neighbors = adjacency[u] || [];
    for (const { target: v, weight } of neighbors) {
      const alt = distances[u] + weight;
      if (alt < distances[v]) {
        distances[v] = alt;
        previous[v] = u;
        pq.enqueue(v, alt);
      }
    }
  }

  // Format Result for UI
  const results: { vertex: string, distance: number | string, path: string[] }[] = [];

  for (const node of nodes) {
    const d = distances[node.id];
    const path: string[] = [];
    let curr: string | null = node.id;

    if (d !== Infinity) {
      while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
      }
    }

    results.push({
      vertex: node.id,
      distance: d === Infinity ? "∞" : d,
      path: d === Infinity ? [] : path
    });
  }

  return results;
};

// --- 4. Minimum Spanning Tree (MST) ---
// Returns a LIST OF EDGES that make up the MST
export const mst = (edges: Edge[], nodes: Node[]): Edge[] => {
  const adjacency: Record<string, { target: string, weight: number }[]> = {};
  nodes.forEach(n => adjacency[n.id] = []);

  // MST treats graph as undirected usually
  edges.forEach(e => {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;
    const w = e.weight || 1;
    adjacency[s].push({ target: t, weight: w });
    adjacency[t].push({ target: s, weight: w });
  });

  const startNode = nodes[0]?.id;
  if (!startNode) return [];

  const visited = new Set<string>();
  const pq = new PriorityQueue<{ u: string, v: string, w: number }>();
  const mstEdges: Edge[] = [];

  visited.add(startNode);
  adjacency[startNode].forEach(n => pq.enqueue({ u: startNode, v: n.target, w: n.weight }, n.weight));

  while (!pq.isEmpty()) {
    const item = pq.dequeue();
    if (!item) break;
    const { u, v, w } = item.element;

    if (visited.has(v)) continue;
    visited.add(v);

    // Add to result
    mstEdges.push({ source: u, target: v, weight: w, id: `${u}-${v}` } as any);

    adjacency[v].forEach(neighbor => {
      if (!visited.has(neighbor.target)) {
        pq.enqueue({ u: v, v: neighbor.target, w: neighbor.weight }, neighbor.weight);
      }
    });
  }

  return mstEdges;
};

// --- 5. Topological Sort ---
export const topologicalSort = (edges: Edge[], nodes: Node[]): string[] => {
  const adjacency: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach(n => {
    adjacency[n.id] = [];
    inDegree[n.id] = 0;
  });

  edges.forEach(e => {
    const s = typeof e.source === 'object' ? e.source.id : e.source;
    const t = typeof e.target === 'object' ? e.target.id : e.target;
    adjacency[s].push(t);
    inDegree[t] = (inDegree[t] || 0) + 1;
  });

  const queue: string[] = [];
  nodes.forEach(n => {
    if (inDegree[n.id] === 0) queue.push(n.id);
  });

  const sorted: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    sorted.push(u);

    adjacency[u].forEach(v => {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    });
  }

  if (sorted.length !== nodes.length) {
    throw new Error("Graph contains a cycle");
  }

  return sorted;
};