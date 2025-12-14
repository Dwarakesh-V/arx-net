export const GRID_SIZE = 40;

export const ALGORITHMS = [
    { name: 'bfs', text: 'BFS', title: 'Breadth-First Search' },
    { name: 'dfs', text: 'DFS', title: 'Depth-First Search' },
    { name: 'dijkstra', text: "Dijkstra's", title: "Dijkstra's Shortest Path" },
    { name: 'floydWarshall', text: 'Floyd Warshall', title: 'Floyd-Warshall Algorithm' },
    { name: 'bellmanFord', text: 'Bellman Ford', title: 'Bellman-Ford Algorithm' },
    { name: 'mst', text: 'MST', title: 'Minimum Spanning Tree' },
    { name: 'topologicalSort', text: 'Topological Sort', title: 'Topological Sorting' },
    { name: 'scc', text: 'SCC', title: 'Strongly Connected Components' },
    { name: 'bcc', text: 'BCC', title: 'Biconnected Components' }
] as const;