import React from 'react';

export default function Algorithms() {
  return (
    <div className="page-content fade-in">
      <h1>Algorithms & Visualization</h1>
      
      <div className="content-box">
        <h2>Running Algorithms</h2>
        <p>
          Arx-Net supports a wide array of classic graph algorithms. To run one, select your target graph, enter any required parameters (like a start node or sink node), and click execute.
        </p>
        
        <h3>Supported Algorithms</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <h4>Search & Traversal</h4>
            <ul>
              <li>Breadth-First Search (BFS)</li>
              <li>Depth-First Search (DFS)</li>
            </ul>
            <h4>Shortest Path</h4>
            <ul>
              <li>Dijkstra's Algorithm</li>
              <li>Bellman-Ford</li>
              <li>Floyd-Warshall (All-Pairs)</li>
            </ul>
          </div>
          <div>
            <h4>Minimum Spanning Tree</h4>
            <ul>
              <li>Kruskal's Algorithm</li>
              <li>Prim's Algorithm</li>
            </ul>
            <h4>Advanced Graph Theory</h4>
            <ul>
              <li>Strongly Connected Components (Kosaraju & Tarjan)</li>
              <li>Biconnected Components (Hopcroft-Tarjan)</li>
              <li>Topological Sort</li>
              <li>Network Flow (Ford-Fulkerson, Edmonds-Karp)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="content-box">
        <h2>Real-Time Playback</h2>
        <p>
          After running an algorithm, you can click the <strong>[Visualize]</strong> link. This isolates the target graph and opens the Playback Controller.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <video autoPlay loop muted playsInline style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <source src="/algorithm%20playback.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
        <ul>
          <li>Watch algorithms traverse nodes step-by-step.</li>
          <li>Pause, rewind, and seek through the execution timeline.</li>
          <li>Adjust the playback speed to observe complex branching at your own pace.</li>
        </ul>
      </div>

      <div className="content-box">
        <h2>Step-by-Step Explanations</h2>
        <p>
          Arx-Net doesn't just show you the answer; it shows you exactly <em>how</em> it arrived there.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <img src="/step_by_step_explanation.png" alt="Step-by-Step Explanation" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>
        <p>
          Opening the explanation panel reveals a detailed breakdown of the execution:
        </p>
        <ul>
          <li><strong>Methodology & Complexity:</strong> A brief theoretical summary of the algorithm's time and space complexity.</li>
          <li><strong>Edge Relaxations:</strong> (For Shortest Path) Detailed logs of which edges successfully lowered the distance to target nodes.</li>
          <li><strong>Cycle Detection:</strong> Alerts and mathematical proofs when algorithms like Bellman-Ford detect negative weight cycles.</li>
          <li><strong>Disjoint Sets:</strong> Explanations of Union-Find operations preventing cycles in Kruskal's MST.</li>
        </ul>
      </div>
    </div>
  );
}
