const genTheory = `
<div style="text-align: left; margin-bottom: 40px;">
    <h3 style="color: #ffc66d; margin-bottom: 10px; text-transform: uppercase;">
        Graph Theory and Algorithmic Analysis
    </h3>
    <div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>
    <p style="font-size: 1.05em; color: #a0a0a0; max-width: 850px;">
        A comprehensive reference document detailing the structural properties of network topologies (graphs
        and trees) and the computational complexities of foundational traversal and optimization algorithms.
    </p>
</div>

<h2
    style="color: #ffc66d; margin-top: 40px; font-size: 1.25em; letter-spacing: 1px; border-bottom: 1px solid #333; padding-bottom: 10px;">
    1. Graph Topologies
</h2>

<p style="color: #ccc;">A graph is a mathematical structure modeling pairwise relations between objects,
    formally defined as a set of Vertices (V) and Edges (E).</p>

<h3 style="margin-top: 0; color: #5bc0de; font-size: 1.1em;">Classifications and Properties</h3>
<ul style="margin-bottom: 0; color: #ccc;">
    <li style="margin-bottom: 8px;"><strong>Directed vs. Undirected:</strong> Undirected graphs feature
        bidirectional edges (symmetric relationships). Directed graphs (Digraphs) possess unidirectional
        edges, indicating a strict one-way relationship from a source vertex to a target vertex.</li>
    <li style="margin-bottom: 8px;"><strong>Unweighted vs. Weighted:</strong> Unweighted graphs assume a
        uniform cost for all edges. Weighted graphs assign a scalar value (cost, distance, or capacity)
        to each edge, heavily influencing traversal optimization.</li>
    <li><strong>Cyclic vs. Acyclic:</strong> Cyclic graphs contain paths that originate and terminate at
        the same vertex. Acyclic graphs lack these structural loops. A <strong>Directed Acyclic Graph
            (DAG)</strong> is a critical topology utilized in modeling dependency networks and
        scheduling constraints.</li>
</ul>

<h2
    style="color: #ffc66d; margin-top: 40px; font-size: 1.25em; letter-spacing: 1px; border-bottom: 1px solid #333; padding-bottom: 10px;">
    2. Tree Structures
</h2>

<p style="color: #ccc;">A tree is an undirected, connected, and strictly acyclic graph. By definition, a
    tree composed of <em>V</em> vertices will always contain exactly <em>V - 1</em> edges, ensuring a single
    unique path between any two disjoint nodes.</p>


<h3 style="margin-top: 0; color: #5cb85c; font-size: 1.1em;">Variants and Implementations</h3>
<ul style="margin-bottom: 0; color: #ccc;">
    <li style="margin-bottom: 8px;"><strong>Binary Search Tree (BST):</strong> A hierarchical structure
        where each node possesses at most two children. It enforces a strict ordering property: the left
        subtree contains values strictly lesser than the parent node, and the right subtree contains
        values strictly greater.</li>
    <li style="margin-bottom: 8px;"><strong>Self-Balancing Trees (Red-Black, AVL):</strong> Standard
        BSTs risk degrading into linear linked lists O(N) if sequentially ordered data is inserted.
        Self-balancing algorithms dynamically perform structural rotations to maintain a logarithmic
        height O(log N), ensuring optimal search, insertion, and deletion efficiency.</li>
    <li><strong>Multi-Way Trees (2-3, 2-3-4 Trees):</strong> Isometric variations where nodes may
        encapsulate multiple discrete values and maintain three or more child pointers. These form the
        theoretical foundation for B-Trees, heavily utilized in persistent storage arrays and relational
        database indexing.</li>
</ul>

<h2
    style="color: #ffc66d; margin-top: 50px; font-size: 1.25em; letter-spacing: 1px; border-bottom: 1px solid #333; padding-bottom: 10px;">
    3. Algorithmic Methodologies & Complexity Analysis
</h2>
<p style="margin-bottom: 30px; color: #ccc;">The following algorithms execute traversal, pathfinding, and
    structural analysis on network topologies. Complexities are denoted in Big-O notation, analyzing time
    complexity concerning Vertices (V) and Edges (E), alongside auxiliary space complexity.</p>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Breadth-First Search (BFS)</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> Traverses the graph
        symmetrically layer-by-layer. It utilizes a First-In-First-Out (FIFO) queue to ensure all immediate
        neighbors of a given vertex are processed prior to progressing to subsequent depths.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(V + E)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V)
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong> Computing
        shortest paths in unweighted networks, network broadcasting, and state-space evaluations in
        artificial intelligence.</p>
</div>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Depth-First Search (DFS)</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> Plunges linearly into the graph
        topology until a terminal node is reached, utilizing a Last-In-First-Out (LIFO) stack (or recursion)
        to backtrack and explore parallel branches.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(V + E)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V)
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong>
        Topological sorting, cycle detection, and serving as the primary traversal engine for advanced
        component-analysis algorithms.</p>
</div>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Dijkstra's Algorithm</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> A greedy paradigm utilizing a
        Min-Priority Queue. It resolves the Single-Source Shortest Path problem by iteratively relaxing the
        edges of the absolute closest known unvisited vertex. Fails deterministically in the presence of
        negative edge weights.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O((V + E) log V)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V)
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong> IP routing
        protocols (e.g., OSPF), geospatial navigation systems, and telecommunication network optimization.
    </p>
</div>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Bellman-Ford Algorithm</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> Computes shortest paths by
        comprehensively relaxing every edge in the graph precisely <em>V - 1</em> times. A subsequent
        <em>V-th</em> pass validates the presence of negative weight cycles (which render shortest paths
        mathematically undefined).
    </p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(V &times; E)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V)
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong>
        Distance-vector routing protocols (e.g., RIP) and identification of arbitrage opportunities in
        algorithmic financial trading.</p>
</div>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Floyd-Warshall Algorithm</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> A dynamic programming approach
        resolving the All-Pairs Shortest Path problem. It systematically assesses whether routing a path
        through an intermediate node <em>K</em> provides a more optimal weight than the direct scalar path
        between nodes <em>I</em> and <em>J</em>.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(V<sup>3</sup>)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V<sup>2</sup>)
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong> Computing
        graph diameter, pre-calculating routing matrices in dense static topographies, and facility location
        optimization.</p>
</div>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Prim's Algorithm (Minimum Spanning Tree)
    </h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> Isolates a sub-graph that
        connects all vertices using the minimal aggregate edge weight. It operates greedily by enqueuing
        edges adjacent to the expanding tree and iteratively extracting the minimum-weight connection that
        incorporates an unvisited node.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(E log V)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V)
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong> Physical
        layout design for infrastructure arrays (electrical grids, fiber-optic distribution), and cluster
        analysis in data mining.</p>
</div>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Kahn's Algorithm (Topological Sort)</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> Establishes a linear dependency
        ordering for Directed Acyclic Graphs. It computes the indegree (incoming edges) of all vertices,
        enqueues those with zero dependencies, and iteratively decrements the indegrees of adjacent nodes as
        elements are processed.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(V + E)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V)
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong>
        Compilation sequence in software build systems (e.g., Make, Webpack), task scheduling, and
        instruction serialization.</p>
</div>

<div
    style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Kosaraju's Algorithm (Strongly Connected
        Components)</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> Identifies maximal subsets of
        mutually reachable vertices within directed graphs. Executes a preliminary DFS to record vertex
        finish times, structurally transposes (reverses) the graph, and conducts a secondary DFS based on
        the finish time sequence to extract the components.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(V + E)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V + E) <span style="font-size: 0.9em; color: #777;">(Requires
            allocation for transposed graph)</span>
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong> Granular
        social network analysis, system modularization, and simplification of highly cyclical component
        dependencies.</p>
</div>

<div style="background: #1d1d1d; border: 1px solid #333; border-radius: 6px; padding: 20px; margin-bottom: 0;">
    <h4 style="margin-top: 0; color: #ffc66d; font-size: 1.15em;">Hopcroft-Tarjan Algorithm (Biconnected
        Components)</h4>
    <p style="color: #ccc; font-size: 0.95em;"><strong>Methodology:</strong> Operates on undirected networks
        to locate Articulation Points (cut vertices). It conducts a comprehensive DFS tracking "discovery
        times" and "low times." If a subtree fails to discover a back-edge to an ancestral node, the parent
        vertex is identified as a critical point of failure.</p>

    <div
        style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333; margin-bottom: 10px;">
        <strong>Time:</strong> O(V + E)
    </div>
    <div style="background: #141414; padding: 8px 12px; border-radius: 4px; border: 1px solid #333;">
        <strong>Space:</strong> O(V + E) <span style="font-size: 0.9em; color: #777;">(Requires stack
            memory proportional to edges)</span>
    </div>

    <p style="color: #a0a0a0; font-size: 0.9em; margin-bottom: 0;"><strong>Applications:</strong> Structural
        resilience modeling, identifying physical vulnerabilities in electrical grids, and maintaining
        redundancy parameters in cybersecurity topologies.</p>
</div>
`

document.addEventListener("DOMContentLoaded", (event) => {
    resultLog.innerHTML = genTheory;
});

genBtn.addEventListener('click',()=>{
    resultLog.innerHTML = genTheory;
});