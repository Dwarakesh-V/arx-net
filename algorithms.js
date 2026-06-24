function vertexExists(edges, vertex, isDirected = true) {
    for (const { source, target } of edges) {
        if (source === vertex || target === vertex) return true;
        if (!isDirected && (target === vertex || source === vertex)) return true;
    }
    return false;
}

function bfs(edges, start = prompt("Enter start vertex"), isDirected = true) {
    // Basic vertex existence check
    const allVertices = new Set();
    for (const { source, target } of edges) {
        allVertices.add(source);
        allVertices.add(target);
    }
    if (start && !allVertices.has(start)) {
        alert("Vertex " + start + " not found.");
        return null;
    }

    // Build the adjacency list
    const graph = {};
    for (const { source, target } of edges) {
        if (!graph[source]) graph[source] = [];
        graph[source].push(target);

        if (!isDirected) {
            if (!graph[target]) graph[target] = [];
            graph[target].push(source);
        }
    }

    // Initialize queues, sets, and tracking variables
    const visited = new Set([start]);
    const queue = [{ node: start, level: 0, parent: null }];
    
    const result = [];
    const levelMap = {}; 
    const steps = [];

    // Traverse the graph
    while (queue.length > 0) {
        const { node, level, parent } = queue.shift();

        // Track results and levels
        result.push(node);
        if (!levelMap[level]) levelMap[level] = [];
        levelMap[level].push(node);

        // Document the step
        let stepDesc = `<strong>Visited '${node}'</strong> at Level ${level}`;
        stepDesc += parent !== null ? ` <em>(reached via '${parent}')</em>.` : ` <em>(Starting Node)</em>.`;
        
        const neighbors = graph[node] || [];
        const addedNeighbors = [];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ node: neighbor, level: level + 1, parent: node });
                addedNeighbors.push(neighbor);
            }
        }

        if (addedNeighbors.length > 0) {
            stepDesc += `<br><span style="color: gray; font-size: 0.9em;">&rarr; Enqueued unvisited neighbors: [${addedNeighbors.join(', ')}] for Level ${level + 1}.</span>`;
        } else {
            stepDesc += `<br><span style="color: gray; font-size: 0.9em;">&rarr; No new unvisited neighbors to enqueue.</span>`;
        }
        steps.push(`<li>${stepDesc}</li>`);
    }

    // --- GENERATE HTML EXPLANATION ---
    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">Breadth-First Search (BFS) explores a graph level by level radiating outward from the start vertex. It utilizes a <strong>Queue (First-In-First-Out)</strong> data structure. When a node is visited, all of its immediately adjacent, unvisited neighbors are pushed to the back of the queue. This guarantees that nodes closer to the start are completely processed before moving deeper.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(V + E)</strong>, where V = number of Vertices and E = number of Edges. Each vertex is added to and removed from the queue exactly once, and every edge is traversed once (or twice if undirected).</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Multiple Valid Answers (Level Permutations)</h3>`;
    explanation += `<p style="margin-top: 0;">Because nodes on the exact same level are equidistant from the start, they can theoretically be visited in any order (dictated purely by how they were ordered in the edge list). This results in multiple valid BFS arrays:</p>`;
    explanation += `<ul>`;
    
    const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);
    
    let totalCombinations = 1;
    for (const [level, nodes] of Object.entries(levelMap)) {
        if (nodes.length > 1) {
            const perms = factorial(nodes.length);
            totalCombinations *= perms;
            explanation += `<li><strong>Level ${level}:</strong> [${nodes.join(', ')}] can be arranged in <strong>${perms}</strong> different valid permutations.</li>`;
        } else {
            explanation += `<li><strong>Level ${level}:</strong> [${nodes[0]}] has 1 fixed position.</li>`;
        }
    }
    explanation += `</ul>`;
    explanation += `<p><strong>&rarr; Total valid BFS permutations</strong> for this graph from vertex '${start}': <strong>${totalCombinations} variations</strong>.</p>`;
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");
    
    return `BFS result: ${result.join(', ')} <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer;">[Explanation]</a>`;
}

function dfs(edges, start = prompt("Enter start vertex"), isDirected = true) {
    // Utilize the external validation function
    if (!vertexExists(edges, start, isDirected)) {
        alert("Vertex " + start + " not found.");
        return null;
    }

    // Build the adjacency list
    const graph = {};
    for (const { source, target } of edges) {
        if (!graph[source]) graph[source] = [];
        graph[source].push(target);

        // For undirected graphs, also include reverse:
        if (!isDirected) {
            if (!graph[target]) graph[target] = [];
            graph[target].push(source);
        }
    }

    const visited = new Set();
    const result = [];
    const steps = [];
    const branchingMap = {}; // Used to calculate permutations

    // Recursive DFS function
    function visit(node, depth, parent) {
        if (visited.has(node)) return;

        visited.add(node);
        result.push(node);

        let stepDesc = `<strong>Visited '${node}'</strong> at Depth ${depth}`;
        stepDesc += parent !== null ? ` <em>(reached via '${parent}')</em>.` : ` <em>(Starting Node)</em>.`;
        steps.push(`<li>${stepDesc}</li>`);

        const neighbors = graph[node] || [];
        // Determine which neighbors are actually viable options right now
        const unvisitedNeighbors = neighbors.filter(n => !visited.has(n));

        if (unvisitedNeighbors.length > 0) {
            steps.push(`<li style="list-style-type: none;"><span style="color: gray; font-size: 0.9em;">&rarr; Exploring branches of '${node}': [${unvisitedNeighbors.join(', ')}].</span></li>`);

            // Track branching permutations for the explanation
            if (unvisitedNeighbors.length > 1) {
                branchingMap[node] = unvisitedNeighbors;
            }

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visit(neighbor, depth + 1, node); // Recursive call
                }
            }
            steps.push(`<li style="list-style-type: none;"><span style="color: gray; font-size: 0.9em;">&larr; Finished all branches of '${node}', backtracking.</span></li>`);
        } else {
            steps.push(`<li style="list-style-type: none;"><span style="color: gray; font-size: 0.9em;">&rarr; Dead end at '${node}', backtracking.</span></li>`);
        }
    }

    // Start the recursive traversal
    visit(start, 0, null);

    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">Depth-First Search (DFS) explores a graph by going as deep as possible along each branch before backtracking. It utilizes a <strong>Stack (Last-In-First-Out)</strong> data structure (handled automatically here via the Call Stack using recursion). When a node is visited, the algorithm immediately suspends the current search to explore the first unvisited neighbor it finds.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(V + E)</strong>, where V = number of Vertices and E = number of Edges. Each vertex is visited exactly once, and every edge is examined once (or twice if undirected) to find unvisited neighbors.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Multiple Valid Answers (Branching Permutations)</h3>`;
    explanation += `<p style="margin-top: 0;">In DFS, valid variations occur when a node has multiple unvisited neighbors. The order in which you choose to traverse these branches completely changes the resulting path:</p>`;
    explanation += `<ul>`;
    
    // Helper function to calculate factorial for permutations
    const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);
    
    let totalCombinations = 1;
    const branchingNodes = Object.keys(branchingMap);

    if (branchingNodes.length > 0) {
        for (const node of branchingNodes) {
            const neighbors = branchingMap[node];
            const perms = factorial(neighbors.length);
            totalCombinations *= perms;
            explanation += `<li><strong>From '${node}':</strong> The branches [${neighbors.join(', ')}] can be explored in <strong>${perms}</strong> different valid orders.</li>`;
        }
    } else {
        explanation += `<li>No branching permutations encountered during this specific traversal path.</li>`;
    }
    
    explanation += `</ul>`;
    explanation += `<p><strong>&rarr; Total valid DFS permutations</strong> based on branching choices from vertex '${start}': <strong>${totalCombinations} variations</strong>.</p>`;
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");
    return `DFS result: ${result.join(', ')} <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer;">[Explanation]</a>`;
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        this.items.push({ element, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

function dijkstra(edges, start = prompt("Enter start vertex"), nodes, isDirected = true) {
    // Utilize the external validation function
    if (!vertexExists(edges, start, isDirected)) {
        alert("Vertex " + start + " not found.");
        return null;
    }

    // Build the adjacency list
    const graph = {};
    for (const { source, target, weight } of edges) {
        if (!graph[source]) graph[source] = [];
        graph[source].push({ target, weight });
        
        // For undirected graphs, also include reverse:
        if (!isDirected) {
            if (!graph[target]) graph[target] = [];
            graph[target].push({ target: source, weight });
        }
    }

    // Ensure all nodes exist in the graph (even disconnected ones)
    for (const node of nodes) {
        if (!graph[node.id]) {
            graph[node.id] = [];
        }
    }

    const distances = {};
    const previous = {};
    const queue = new PriorityQueue(); // Assumes your PriorityQueue implementation is available
    const steps = [];

    // Initialization
    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;
    queue.enqueue(start, 0);

    steps.push(`<li><strong>Initialization:</strong> Set distance to start vertex '${start}' as 0, and all other vertices to &infin;. Enqueued '${start}'.</li>`);

    // Main Dijkstra Loop
    while (!queue.isEmpty()) {
        const { element: currentNode } = queue.dequeue();
        const neighbors = graph[currentNode] || [];

        // Documenting the current node being processed
        let stepDesc = `<strong>Processing '${currentNode}'</strong> <em>(Current shortest distance: ${distances[currentNode]})</em>`;
        let neighborSteps = [];

        for (const { target, weight } of neighbors) {
            const alt = distances[currentNode] + weight;
            const prevDist = distances[target] === Infinity ? "&infin;" : distances[target];

            if (alt < distances[target]) {
                distances[target] = alt;
                previous[target] = currentNode;
                queue.enqueue(target, alt);
                neighborSteps.push(`<li>&rarr; Found shorter path to '${target}' via '${currentNode}' (Cost: ${distances[currentNode]} + ${weight} = <strong>${alt}</strong>). Updated distance from ${prevDist} to ${alt} and enqueued '${target}'.</li>`);
            } else {
                neighborSteps.push(`<li>&rarr; Checked path to '${target}' via '${currentNode}' (Cost: ${distances[currentNode]} + ${weight} = ${alt}). This is &ge; the known shortest distance (${prevDist}), so it is ignored.</li>`);
            }
        }

        if (neighborSteps.length > 0) {
            stepDesc += `<ul style="color: gray; font-size: 0.9em; list-style-type: none; padding-left: 15px; margin-top: 5px;">${neighborSteps.join('')}</ul>`;
        } else {
            stepDesc += `<div style="color: gray; font-size: 0.9em; padding-left: 15px; margin-top: 5px;">&rarr; No outgoing edges to explore.</div>`;
        }

        steps.push(`<li>${stepDesc}</li>`);
    }
    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">Dijkstra's Algorithm finds the shortest path from a starting vertex to all other vertices in a weighted graph. It uses a <strong>Priority Queue</strong> to continually explore the unvisited vertex with the smallest known accumulated distance. As it explores, it performs "edge relaxation"-if it finds a path to a neighbor that is cheaper than the currently known path, it updates the neighbor's shortest distance and pushes it into the queue.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O((V + E) log V)</strong>, assuming the use of a Min-Priority Queue (where V = Vertices and E = Edges). Extracting the minimum element takes logarithmic time, and this must be done for every vertex and edge updated.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Multiple Valid Paths (Tie-Breaking)</h3>`;
    explanation += `<p style="margin-top: 0;">If there are two distinct paths to the exact same node that share the exact same total weight, the algorithm breaks the tie arbitrarily (usually depending on the internal implementation of the Priority Queue or the order edges were parsed). Only one of the mathematically identical optimal paths will be returned in the final table.</p>`;
    
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");

    const tableHtml = `
    <table border="1" cellpadding="5" cellspacing="0" style="margin-bottom: 10px;">
        <tr><th>Vertex</th><th>Distance</th><th>Path</th></tr>
        ${Object.keys(distances).map(vertex => {
            let path = [];
            let current = vertex;
            while (current !== null) {
                path.unshift(current);
                current = previous[current];
            }
            return `
                <tr>
                    <td>${vertex}</td>
                    <td>${distances[vertex] === Infinity ? "∞" : distances[vertex]}</td>
                    <td>${distances[vertex] === Infinity ? "unreachable" : path.join(" → ")}</td>
                </tr>
            `;
        }).join("")}
    </table>
    `;

    return `
        <div>
            ${tableHtml}
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer;">[Explanation]</a>
        </div>
    `;
}

function floydWarshall(edges, directed = true) {
    const graph = {};
    const nodes = new Set();

    // Build the adjacency dictionary
    for (const { source, target, weight } of edges) {
        if (!graph[source]) graph[source] = {};
        if (!graph[target]) graph[target] = {};
        graph[source][target] = weight;
        
        // For undirected graphs, also include reverse:
        if (!directed) graph[target][source] = weight; 
        
        nodes.add(source);
        nodes.add(target);
    }

    const dist = {};
    const next = {};
    const steps = [];

    // Initialization Phase
    for (const node of nodes) {
        dist[node] = {};
        next[node] = {};
        for (const otherNode of nodes) {
            if (node === otherNode) {
                dist[node][otherNode] = 0;
            } else if (graph[node][otherNode] !== undefined) { // Patched to support 0-weight edges
                dist[node][otherNode] = graph[node][otherNode];
            } else {
                dist[node][otherNode] = Infinity;
            }
            next[node][otherNode] = otherNode;
        }
    }

    steps.push(`<li><strong>Initialization:</strong> Created an initial distance matrix based only on direct, adjacent edge weights. All non-adjacent paths temporarily set to &infin;.</li>`);

    // Main Floyd-Warshall DP Loop
    for (const k of nodes) {
        let updates = [];
        for (const i of nodes) {
            for (const j of nodes) {
                // Optimization to skip unreachable paths
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        const oldDist = dist[i][j] === Infinity ? "&infin;" : dist[i][j];
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = next[i][k];
                        updates.push(`&rarr; Improved path <strong>${i} &rarr; ${j}</strong> from ${oldDist} to <strong>${dist[i][j]}</strong> (by routing via intermediate node '${k}').`);
                    }
                }
            }
        }
        
        // Document the updates for this phase
        if (updates.length > 0) {
            steps.push(`<li><strong>Phase k = '${k}':</strong> Allowed '${k}' to act as an intermediate routing node.<br><ul style="color: gray; font-size: 0.9em; list-style-type: none; padding-left: 15px; margin-top: 5px;"><li>${updates.join('</li><li>')}</li></ul></li>`);
        } else {
            steps.push(`<li><strong>Phase k = '${k}':</strong> Allowed '${k}' to act as an intermediate routing node. <em>No shorter paths were found.</em></li>`);
        }
    }

    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">The Floyd-Warshall Algorithm solves the <strong>All-Pairs Shortest Path</strong> problem. Instead of starting from a single node like Dijkstra, it calculates the shortest path between every possible pair of vertices simultaneously using Dynamic Programming. It iteratively picks a vertex <em>k</em> and checks if routing a path through <em>k</em> makes the journey between any two other nodes <em>i</em> and <em>j</em> shorter than the previously known best distance.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(V<sup>3</sup>)</strong>, where V = number of Vertices. The algorithm requires three heavily nested loops to check every starting node, against every target node, routing through every possible intermediate node.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal (Edge Relaxations)</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Multiple Valid Paths (Tie-Breaking)</h3>`;
    explanation += `<p style="margin-top: 0;">If multiple paths between two nodes share the exact same minimum weight, the algorithm breaks the tie by keeping the oldest path it found. Because the core condition strictly requires <code>dist[i][j] > dist[i][k] + dist[k][j]</code>, it will ignore newly discovered paths that merely equal the current best path.</p>`;
    
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");

    // Generate the original table structures
    const tablesHtml = Array.from(nodes).map(i => `
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 5px 0;">From: ${i}</h4>
            <table border="1" cellpadding="5" cellspacing="0">
                <tr><th>To</th><th>Distance</th><th>Path</th></tr>
                ${Array.from(nodes).map(j => {
                    if (i === j) return '';
                    const distance = dist[i][j] === Infinity ? "∞" : dist[i][j];
                    let path = [];
                    let u = i;
                    
                    if (next[i][j] === undefined) {
                        return `
                        <tr>
                            <td>${j}</td>
                            <td>∞</td>
                            <td>unreachable</td>
                        </tr>`;
                    }
                    
                    while (u !== j) {
                        path.push(u);
                        u = next[u][j];
                        if (u === undefined) break;
                    }
                    path.push(j);
                    
                    return `
                    <tr>
                        <td>${j}</td>
                        <td>${distance}</td>
                        <td>${distance === "∞" ? "unreachable" : path.join(" → ")}</td>
                    </tr>`;
                }).join('')}
            </table>
        </div>
    `).join('');

    // Return the tables appended with the formatted link
    return `
        <div>
            ${tablesHtml}
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer; display: inline-block; margin-top: 10px;">[Explanation]</a>
        </div>
    `;
}

function bellmanFord(edges, start = prompt("Enter start vertex"), nodes, isDirected = true) {
    // Utilize the external validation function
    if (!vertexExists(edges, start, isDirected)) {
        alert("Vertex " + start + " not found.");
        return null;
    }

    const graph = {};
    const allEdges = []; // Fixed: explicitly track all edges for the relaxation loop

    for (const { source, target, weight } of edges) {
        if (!graph[source]) graph[source] = [];
        graph[source].push({ target, weight });
        allEdges.push({ source, target, weight });

        // For undirected graphs, also include reverse:
        if (!isDirected) {
            if (!graph[target]) graph[target] = [];
            graph[target].push({ target: source, weight });
            allEdges.push({ source: target, target: source, weight }); // Ensure reverse edge is evaluated
        }
    }

    // Ensure all nodes exist in the graph (even disconnected ones)
    for (const node of nodes) {
        if (!graph[node.id]) {
            graph[node.id] = [];
        }
    }

    const distances = {};
    const previous = {};
    const steps = [];

    // Initialization
    for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
    }
    distances[start] = 0;

    steps.push(`<li><strong>Initialization:</strong> Set distance to start vertex '${start}' as 0, and all other vertices to &infin;.</li>`);

    const numVertices = Object.keys(graph).length;

    // Main Bellman-Ford DP Loop: Relax all edges (V - 1) times
    let earlyTermination = false;
    for (let i = 1; i < numVertices; i++) {
        let updates = [];
        let relaxedAny = false;

        for (const { source, target, weight } of allEdges) {
            if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
                const oldDist = distances[target] === Infinity ? "&infin;" : distances[target];
                distances[target] = distances[source] + weight;
                previous[target] = source;
                relaxedAny = true;
                updates.push(`&rarr; Relaxed edge <strong>${source} &rarr; ${target}</strong>: Updated distance from ${oldDist} to <strong>${distances[target]}</strong> <em>(Cost: ${distances[source]} + ${weight})</em>.`);
            }
        }

        if (updates.length > 0) {
            steps.push(`<li><strong>Iteration ${i} of ${numVertices - 1}:</strong><br><ul style="color: gray; font-size: 0.9em; list-style-type: none; padding-left: 15px; margin-top: 5px;"><li>${updates.join('</li><li>')}</li></ul></li>`);
        } else {
            steps.push(`<li><strong>Iteration ${i} of ${numVertices - 1}:</strong> No edges were relaxed. Algorithm can safely terminate early.</li>`);
            earlyTermination = true;
            break; // Optimization: If no distances changed, further iterations are useless
        }
    }

    // Check for negative weight cycles
    let hasNegativeCycle = false;
    if (!earlyTermination) {
        for (const { source, target, weight } of allEdges) {
            if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
                hasNegativeCycle = true;
                break;
            }
        }
    }

    if (hasNegativeCycle) {
        steps.push(`<li><strong style="color: red;">Negative Cycle Detection (Iteration ${numVertices}):</strong> Found an edge that can STILL be relaxed! This mathematically proves the existence of a <strong>Negative Weight Cycle</strong>. Valid shortest paths cannot be determined.</li>`);
    } else {
        steps.push(`<li><strong style="color: green;">Negative Cycle Detection (Iteration ${numVertices}):</strong> No further edges could be relaxed. The graph is free of negative weight cycles.</li>`);
    }

    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">The Bellman-Ford Algorithm computes shortest paths from a single source vertex to all other vertices. Unlike Dijkstra's Algorithm, it is capable of handling graphs with negative edge weights. It operates on the principle of <strong>Edge Relaxation</strong>, iteratively checking every single edge in the graph. By repeating this process <em>V - 1</em> times (where V is the number of vertices), it guarantees that shortest paths propagate fully across the network.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(V &times; E)</strong>, where V = number of Vertices and E = number of Edges. This is slower than Dijkstra, but necessary to safely account for negative weights without missing optimal paths.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal (Edge Relaxations)</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Negative Weight Cycles</h3>`;
    explanation += `<p style="margin-top: 0;">A negative weight cycle is a loop of edges where the total sum of their weights is negative. If one exists, you could loop through it infinitely to keep reducing your total distance to ∞. Bellman-Ford detects this by running a final <em>V-th</em> check: if any distance can STILL be optimized after <em>V - 1</em> iterations, a negative cycle absolutely exists.</p>`;
    
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");
    
    // If a negative cycle exists, alert the user and return a visual warning instead of the broken table
    if (hasNegativeCycle) {
        alert("Graph contains a negative weight cycle.");
        return `
            <div style="color: red; font-weight: bold; margin-bottom: 10px;">
                &#9888; Algorithm Failed: Graph contains a Negative Weight Cycle. Distances cannot be calculated.
            </div>
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer;">[Explanation]</a>
        `;
    }

    // Generate the standard table if successful
    const tableHtml = `
    <table border="1" cellpadding="5" cellspacing="0" style="margin-bottom: 10px;">
        <tr><th>Vertex</th><th>Distance</th><th>Path</th></tr>
        ${Object.keys(distances).map(vertex => {
            let path = [];
            let current = vertex;
            while (current !== null) {
                path.unshift(current);
                current = previous[current];
            }
            return `
                <tr>
                    <td>${vertex}</td>
                    <td>${distances[vertex] === Infinity ? "∞" : distances[vertex]}</td>
                    <td>${distances[vertex] === Infinity ? "unreachable" : path.join(" → ")}</td>
                </tr>
            `;
        }).join("")}
    </table>
    `;

    return `
        <div>
            ${tableHtml}
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer;">[Explanation]</a>
        </div>
    `;
}

function mst(edges, weighted, graphName) {
    const graph = {};
    const steps = [];

    // Validation for unweighted graphs
    if (!weighted) {
        alert("Minimum Spanning Tree requires weighted edges, assuming all weights are 1.");
    }

    // Build the adjacency list
    for (const { source, target, weight } of edges) {
        if (!graph[source]) graph[source] = [];
        if (!graph[target]) graph[target] = [];
        
        const w = weight !== undefined ? weight : 1; 
        
        graph[source].push({ target, weight: w });
        graph[target].push({ target: source, weight: w }); // Undirected by definition for MST
    }

    const visited = new Set();
    const pq = new PriorityQueue(); // Assumes Min-Priority Queue
    const mstEdges = [];
    let totalCost = 0;

    const startNode = Object.keys(graph)[0];
    if (!startNode) {
        return null;
    }

    // Initialization
    visited.add(startNode);
    steps.push(`<li><strong>Initialization:</strong> Selected arbitrary start node '${startNode}' and marked as visited.</li>`);

    const initialEdges = [];
    for (const neighbor of graph[startNode]) {
        pq.enqueue({ from: startNode, to: neighbor.target }, neighbor.weight);
        initialEdges.push(`'${startNode}' &rarr; '${neighbor.target}' (Cost: ${neighbor.weight})`);
    }
    
    if (initialEdges.length > 0) {
        steps.push(`<li><span style="color: gray; font-size: 0.9em;">&rarr; Enqueued initial outgoing edges: [${initialEdges.join(', ')}].</span></li>`);
    }

    // Main Prim's Algorithm Loop
    while (!pq.isEmpty()) {
        const { element, priority: weight } = pq.dequeue();
        const { from, to } = element;

        // Cycle Detection
        if (visited.has(to)) {
            steps.push(`<li><span style="color: #d9534f;"><strong>Discarded edge</strong> '${from}' &rarr; '${to}' (Cost: ${weight}): Node '${to}' is already visited. Including it would create a cycle.</span></li>`);
            continue;
        }

        // Add to MST
        visited.add(to);
        mstEdges.push({ source: from, target: to, weight });
        totalCost += weight;

        let stepDesc = `<strong>Added edge '${from}' &rarr; '${to}' (Cost: ${weight})</strong> to the Minimum Spanning Tree. Node '${to}' is now visited.`;

        // Queue new neighbors
        const neighbors = graph[to];
        const addedNeighbors = [];
        if (Array.isArray(neighbors)) {
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.target)) {
                    pq.enqueue({ from: to, to: neighbor.target }, neighbor.weight);
                    addedNeighbors.push(`'${to}' &rarr; '${neighbor.target}' (Cost: ${neighbor.weight})`);
                }
            }
        }

        if (addedNeighbors.length > 0) {
            stepDesc += `<br><span style="color: gray; font-size: 0.9em;">&rarr; Enqueued new outgoing edges from '${to}': [${addedNeighbors.join(', ')}].</span>`;
        } else {
            stepDesc += `<br><span style="color: gray; font-size: 0.9em;">&rarr; No new unvisited neighbors to enqueue from '${to}'.</span>`;
        }
        steps.push(`<li>${stepDesc}</li>`);
    }

    steps.push(`<li><strong>Completion:</strong> Minimum Spanning Tree constructed with a total weight of <strong>${totalCost}</strong>.</li>`);

    // Generate the Edge String
    let mstResult = '';
    for (const edge of mstEdges) {
        mstResult += `(${edge.source},${edge.target},${edge.weight}),`
    }
    if (mstResult.length > 0) {
        mstResult = mstResult.slice(0, -1); // Remove trailing comma
    }

    addGraph(mstResult, null, `${graphName} MST`, false, false);

    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">This uses <strong>Prim's Algorithm</strong> to find the Minimum Spanning Tree (MST). An MST is a subset of edges that connects all vertices in the graph together without any cycles, while ensuring the lowest possible total edge weight. Prim's operates greedily: it starts from an arbitrary node, throws all connected edges into a Priority Queue, and continually picks the cheapest available edge that expands the tree into an unvisited node.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(E log V)</strong>, where V = number of Vertices and E = number of Edges (assuming a standard Binary Min-Heap Priority Queue). Extracting the minimum edge takes logarithmic time, and the algorithm evaluates every edge once.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Multiple Valid Trees (Tie-Breaking)</h3>`;
    explanation += `<p style="margin-top: 0;">If two available edges share the exact same minimum weight, the Priority Queue will break the tie arbitrarily. Choosing one edge over the other can drastically alter the shape and pathing of the final tree. However, it is mathematically guaranteed that all valid resulting tree shapes will share the exact same minimal total cost.</p>`;
    
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");
    
    // Return the formatted result with the embedded link
    return `
        <div>
            <strong>MST edges:</strong> ${mstResult || "None"} <br>
            <strong>Total Cost:</strong> ${totalCost} 
            <br>
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer;">[Explanation]</a>
        </div>
    `;
}

function topologicalSort(edges) {
    const graph = {};
    const inDegree = {};
    const steps = [];

    // Build the graph and calculate initial In-Degrees
    for (const { source, target } of edges) {
        if (!graph[source]) graph[source] = [];
        if (!graph[target]) graph[target] = [];
        graph[source].push(target);
        inDegree[target] = (inDegree[target] || 0) + 1;
        inDegree[source] = inDegree[source] || 0; // Ensure source exists in inDegree map
    }

    const queue = [];
    for (const node in inDegree) {
        if (inDegree[node] === 0) {
            queue.push(node);
        }
    }

    steps.push(`<li><strong>Initialization:</strong> Calculated in-degrees for all vertices. Enqueued nodes with no incoming dependencies (In-Degree = 0): <strong>[${queue.join(', ') || "None"}]</strong>.</li>`);

    const sorted = [];
    let hasMultiplePermutations = false;

    // Main Kahn's Algorithm Loop
    while (queue.length > 0) {
        // Track if there are multiple valid choices right now
        if (queue.length > 1) {
            hasMultiplePermutations = true;
        }

        const node = queue.shift();
        sorted.push(node);

        let stepDesc = `<strong>Processed '${node}'</strong>. Added to sorted sequence.`;
        const neighbors = graph[node] || [];
        const freedNeighbors = [];

        for (const neighbor of neighbors) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
                freedNeighbors.push(neighbor);
            }
        }

        if (freedNeighbors.length > 0) {
            stepDesc += `<br><span style="color: gray; font-size: 0.9em;">&rarr; Decremented neighbors. The following nodes reached In-Degree 0 and were enqueued: [${freedNeighbors.join(', ')}].</span>`;
        } else if (neighbors.length > 0) {
            stepDesc += `<br><span style="color: gray; font-size: 0.9em;">&rarr; Decremented neighbors [${neighbors.join(', ')}], but none reached In-Degree 0 yet.</span>`;
        } else {
            stepDesc += `<br><span style="color: gray; font-size: 0.9em;">&rarr; No outgoing edges to decrement.</span>`;
        }

        steps.push(`<li>${stepDesc}</li>`);
    }

    // Cycle Check
    const totalNodes = Object.keys(inDegree).length;
    const hasCycle = sorted.length !== totalNodes;

    if (hasCycle) {
        steps.push(`<li><strong style="color: red;">Cycle Detection:</strong> The algorithm halted prematurely. Only ${sorted.length} out of ${totalNodes} nodes were sorted. The remaining nodes are stuck in a dependency cycle and will never reach an In-Degree of 0.</li>`);
    } else {
        steps.push(`<li><strong style="color: green;">Completion:</strong> All ${totalNodes} nodes successfully sorted. No cycles detected.</li>`);
    }

    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">This uses <strong>Kahn's Algorithm</strong> for Topological Sorting. It is used to linearly order a Directed Acyclic Graph (DAG) such that for every directed edge <em>U &rarr; V</em>, vertex <em>U</em> comes before <em>V</em>. It relies on calculating the <strong>In-Degree</strong> (number of incoming edges) of each node. Nodes with an In-Degree of 0 have no prerequisites and are placed in a Queue. As they are processed, they are "removed" from the graph, decreasing the In-Degree of their neighbors. If a neighbor drops to 0, it is added to the Queue.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(V + E)</strong>, where V = number of Vertices and E = number of Edges. Calculating the initial in-degrees takes time proportional to the number of edges, and the main loop processes every vertex and its outgoing edges exactly once.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Multiple Valid Sorts (Permutations)</h3>`;
    if (hasMultiplePermutations) {
        explanation += `<p style="margin-top: 0;">Because the Queue contained multiple nodes at the same time during this traversal, those nodes had no dependencies on each other. This means they could have theoretically been popped and processed in any order. Consequently, <strong>this specific graph has multiple valid topological permutations.</strong></p>`;
    } else if (hasCycle) {
        explanation += `<p style="margin-top: 0;">A full topological sort is impossible for this graph due to the cyclic dependencies.</p>`;
    } else {
        explanation += `<p style="margin-top: 0;">During this traversal, the Queue never contained more than one node at a time. This implies that there is a strict, linear dependency chain across the entire graph. Consequently, <strong>there is exactly 1 valid topological sort permutation.</strong></p>`;
    }
    
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");
    
    if (hasCycle) {
        alert("Graph has at least one cycle.");
        return `
            <div style="color: red; font-weight: bold; margin-bottom: 10px;">
                &#9888; Algorithm Failed: Graph contains a dependency cycle. Topological sort is mathematically impossible.
            </div>
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer;">[Explanation]</a>
        `;
    }

    return `
        <div>
            <strong>Topological Sort:</strong> [${sorted.join(', ')}]
            <br>
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer; display: inline-block; margin-top: 5px;">[Explanation]</a>
        </div>
    `;
}

function StronglyConnectedComponents(edges) {
    const graph = {};
    const reverseGraph = {};
    const allNodes = new Set();
    const steps = [];

    // Build original and transposed graphs
    for (const { source, target } of edges) {
        if (!graph[source]) graph[source] = [];
        if (!graph[target]) graph[target] = []; // Ensure targets exist as keys
        if (!reverseGraph[target]) reverseGraph[target] = [];
        if (!reverseGraph[source]) reverseGraph[source] = []; // Ensure sources exist in reverse
        
        graph[source].push(target);
        reverseGraph[target].push(source);
        
        // Track all unique nodes to prevent the "sink node" skipping bug
        allNodes.add(source);
        allNodes.add(target);
    }

    const visited = new Set();
    const stack = [];

    steps.push(`<li><strong>Phase 1 (Original DFS):</strong> Traversing the original graph to determine node finish times.</li>`);

    function dfs(node) {
        visited.add(node);
        steps.push(`<li style="list-style-type: none;"><span style="color: gray; font-size: 0.9em;">&rarr; Visited '${node}'.</span></li>`);
        
        for (const neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }
        stack.push(node);
        steps.push(`<li style="list-style-type: none;"><span style="color: #5bc0de; font-size: 0.9em;">&larr; Finished exploring '${node}'. Pushed to Stack.</span></li>`);
    }

    for (const node of allNodes) {
        if (!visited.has(node)) {
            steps.push(`<li>Starting new DFS tree from unvisited node '${node}'.</li>`);
            dfs(node);
        }
    }

    steps.push(`<li><strong>Phase 2 (Graph Transposition):</strong> The graph's edges are virtually reversed. The Stack (top to bottom) is currently: <strong>[${[...stack].reverse().join(', ')}]</strong>.</li>`);

    visited.clear();
    const sccs = [];

    steps.push(`<li><strong>Phase 3 (Reverse DFS):</strong> Popping nodes from the stack and exploring the reversed graph to extract components.</li>`);

    function reverseDfs(node, component) {
        visited.add(node);
        component.push(node);
        steps.push(`<li style="list-style-type: none;"><span style="color: gray; font-size: 0.9em;">&rarr; Added '${node}' to current component.</span></li>`);

        for (const neighbor of reverseGraph[node] || []) {
            if (!visited.has(neighbor)) {
                reverseDfs(neighbor, component);
            }
        }
    }

    while (stack.length > 0) {
        const node = stack.pop();
        if (!visited.has(node)) {
            const component = [];
            steps.push(`<li>Popped unvisited node '${node}'. Starting new SCC extraction.</li>`);
            reverseDfs(node, component);
            sccs.push(component);
            steps.push(`<li><strong style="color: #5cb85c;">Found strongly connected component:</strong> {${component.join(', ')}}</li>`);
        } else {
            steps.push(`<li><span style="color: gray; font-size: 0.9em;">Popped '${node}' from stack, but it was already assigned to a component. Skipped.</span></li>`);
        }
    }

    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">This uses <strong>Kosaraju's Algorithm</strong> to find Strongly Connected Components (SCCs). An SCC is a self-contained cycle of vertices where every node can reach every other node within that specific group. The algorithm operates in two main passes: First, it performs a DFS on the original graph, pushing nodes to a Stack only after all their outgoing paths are fully explored (tracking their "finish times"). Second, it reverses all the edges in the graph. By popping nodes off the Stack and running a second DFS on this reversed graph, it isolates the strongly connected clusters without accidentally bleeding into adjacent components.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(V + E)</strong>, where V = number of Vertices and E = number of Edges. The algorithm performs two standard DFS traversals and one matrix transposition, all of which scale linearly.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Multiple Valid Paths vs. Fixed Outcomes</h3>`;
    explanation += `<p style="margin-top: 0;">During Phase 1, if a node has multiple outgoing edges, the order in which they are traversed can drastically change the final sequence of the Stack. However, Strongly Connected Components are an objective mathematical property of the graph. Regardless of the traversal permutations that shuffle the internal Stack, <strong>the final isolated groupings (the SCCs themselves) will always be exactly the same.</strong></p>`;
    
    explanation += `</div>`;

    let sccResult = '';
    for (const component of sccs) {
        sccResult += `{${component.join(', ')}}, `;
    }
    if (sccResult.length > 0) {
        sccResult = sccResult.slice(0, -2);
    }

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");
    
    return `
        <div>
            <strong>SCC Result:</strong> ${sccResult || "None"} 
            <br>
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer; display: inline-block; margin-top: 5px;">[Explanation]</a>
        </div>
    `;
}

function BiconnectedComponents(edges) {
    const graph = {};
    const allNodes = new Set();
    const steps = [];

    // Build undirected graph
    for (const { source, target } of edges) {
        if (!graph[source]) graph[source] = [];
        if (!graph[target]) graph[target] = [];
        graph[source].push(target);
        graph[target].push(source); // undirected
        
        allNodes.add(source);
        allNodes.add(target);
    }

    let time = 0;
    const disc = {};
    const low = {};
    const parent = {};
    const stack = [];
    const bcc = [];

    // Main DFS function
    function dfs(u) {
        disc[u] = low[u] = ++time;
        let children = 0;
        
        steps.push(`<li style="list-style-type: none;"><span style="color: gray; font-size: 0.9em;">&rarr; Visited '${u}'. Assigned Discovery Time = ${disc[u]}, Low = ${low[u]}.</span></li>`);

        for (const v of graph[u] || []) {
            if (!disc[v]) { // Unvisited neighbor (Tree Edge)
                parent[v] = u;
                children++;
                stack.push([u, v]);
                steps.push(`<li style="list-style-type: none;"><span style="color: gray; font-size: 0.9em;">&rarr; Exploring tree edge '${u}' - '${v}'. Pushed edge to stack.</span></li>`);

                dfs(v); // Recursive call

                // Update low value of u based on subtree
                const oldLow = low[u];
                low[u] = Math.min(low[u], low[v]);
                if (low[u] !== oldLow) {
                     steps.push(`<li style="list-style-type: none;"><span style="color: #5bc0de; font-size: 0.9em;">&larr; Backtracked to '${u}' from '${v}'. Updated Low['${u}'] from ${oldLow} to ${low[u]}.</span></li>`);
                }

                // Articulation Point condition check
                // (If u is root and has >1 children) OR (If u is not root and low[v] >= disc[u])
                if ((parent[u] === null && children > 1) || (parent[u] !== null && low[v] >= disc[u])) {
                    const component = [];
                    let edge;
                    do {
                        edge = stack.pop();
                        component.push(edge);
                    } while (edge[0] !== u || edge[1] !== v);
                    
                    bcc.push(component);
                    
                    const edgeStrs = component.map(e => `(${e[0]}-${e[1]})`).join(', ');
                    steps.push(`<li><strong style="color: #5cb85c;">Articulation Point detected at '${u}'. Extracted Biconnected Component:</strong> {${edgeStrs}}</li>`);
                }
            } else if (v !== parent[u] && disc[v] < disc[u]) { // Back Edge detection
                stack.push([u, v]);
                const oldLow = low[u];
                low[u] = Math.min(low[u], disc[v]);
                steps.push(`<li><span style="color: #f0ad4e; font-size: 0.9em;">&rarr; Found back edge '${u}' - '${v}'. Pushed edge to stack. Updated Low['${u}'] from ${oldLow} to ${low[u]}.</span></li>`);
            }
        }
    }

    // Process all nodes (handles disconnected components securely)
    for (const node of allNodes) {
        if (!disc[node]) {
            parent[node] = null; // Explicitly mark as root
            steps.push(`<li><strong>Starting new DFS tree from unvisited node '${node}'.</strong></li>`);
            dfs(node);
            
            if (stack.length > 0) {
                const component = stack.splice(0); // Safely grab all remaining edges
                bcc.push(component);
                
                const edgeStrs = component.map(e => `(${e[0]}-${e[1]})`).join(', ');
                steps.push(`<li><strong style="color: #5cb85c;">DFS tree completed. Extracted remaining edges as Biconnected Component:</strong> {${edgeStrs}}</li>`);
            }
        }
    }

    let explanation = `<div style="font-family: system-ui, sans-serif; line-height: 1.5;">`;
    
    explanation += `<h3 style="margin-bottom: 5px;">Methodology</h3>`;
    explanation += `<p style="margin-top: 0;">This uses the <strong>Hopcroft-Tarjan Algorithm</strong> to find Biconnected Components. A Biconnected Component is a maximal subgraph where the removal of any single vertex will NOT disconnect the subgraph. The algorithm performs a Depth-First Search (DFS) while maintaining two values for each node: <strong>Discovery Time</strong> (when it was first visited) and <strong>Low Time</strong> (the earliest discovered node reachable from its subtree, including back edges).</p>`;
    explanation += `<p style="margin-top: 0;">If a node <em>U</em> has a child <em>V</em> that cannot reach any node discovered before <em>U</em> (i.e., <code>low[V] &ge; disc[U]</code>), it means removing <em>U</em> traps <em>V</em> and breaks the graph apart. Therefore, <em>U</em> is an <strong>Articulation Point</strong>. Whenever this condition is met, the algorithm pops all recently traversed edges from a Stack to group them into an isolated Biconnected Component.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Time Complexity</h3>`;
    explanation += `<p style="margin-top: 0;"><strong>O(V + E)</strong>, where V = number of Vertices and E = number of Edges. The algorithm achieves this linear efficiency because it only requires a single DFS pass to calculate discovery times, low times, and identify back edges simultaneously.</p>`;

    explanation += `<h3 style="margin-bottom: 5px;">Step-by-Step Traversal</h3>`;
    explanation += `<ul style="margin-top: 0;">${steps.join('')}</ul>`;

    explanation += `<h3 style="margin-bottom: 5px;">Component Composition</h3>`;
    explanation += `<p style="margin-top: 0;">Unlike Strongly Connected Components which group <em>vertices</em>, Biconnected Components inherently group <strong>edges</strong>. A single Articulation Point (vertex) can belong to multiple Biconnected Components, acting as the bridge between them. Edges, however, belong strictly to one component.</p>`;
    
    explanation += `</div>`;

    const safeExplanation = encodeURIComponent(explanation).replace(/'/g, "%27");
    
    // Generate the Result String
    let bccResult = '';
    for (let i = 0; i < bcc.length; i++) {
        bccResult += `{`;
        for (let j = 0; j < bcc[i].length; j++) {
            bccResult += `(${bcc[i][j][0]},${bcc[i][j][1]}), `;
        }
        if (bcc[i].length > 0) bccResult = bccResult.slice(0, -2);
        bccResult += '}, ';
    }
    if (bccResult.length > 0) {
        bccResult = bccResult.slice(0, -2);
    }

    return `
        <div>
            <strong>Biconnected Components:</strong> ${bccResult || "None"} 
            <br>
            <a href="javascript:void(0);" onclick="resultLog.innerHTML = decodeURIComponent('${safeExplanation}');" style="color: #ffc66d; text-decoration: underline; cursor: pointer; display: inline-block; margin-top: 5px;">[Explanation]</a>
        </div>
    `;
}
