const routes = {
  '/': `
    <div class="page-content fade-in">
      <h1>Arx-Net Documentation</h1>
      
      <div class="content-box">
        <h2>What is Arx-Net?</h2>
        <p>
          Arx-Net is a powerful, open-source graph visualization and algorithm simulation tool 
          built entirely with Vanilla JavaScript and D3.js. It allows you to create complex network topologies, 
          run classical graph algorithms, and visualize step-by-step executions in real-time.
        </p>
        
        <div class="media-split-view">
          <div class="media-container">
            <img src="./dashboard.png" alt="Dashboard Showcase Laptop" />
            <div class="media-label">Laptop View</div>
          </div>
          <div class="media-container">
            <img src="./dashboard_mobile.jpeg" alt="Dashboard Showcase Mobile" />
            <div class="media-label">Mobile View</div>
          </div>
        </div>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Procedural Graph Generation:</strong> Quickly build massive randomized graphs or specific tree structures (BST, AVL, B+ Trees).</li>
          <li><strong>Real-Time Visualization:</strong> Watch algorithms like Dijkstra, Kruskal, and Tarjan's SCC evaluate networks visually.</li>
          <li><strong>Interactive Sandbox:</strong> Drag, pan, and zoom topologies, and monitor real-time statistics like active Vertex and Edge counts.</li>
          <li><strong>Python Interoperability:</strong> Seamlessly integrate with Python's <code>networkx</code> library.</li>
        </ul>
      </div>

      <div class="content-box">
        <h2>Quick Start</h2>
        <p>
          You don't need to install anything to use the web-based visualizer. Simply open the main application and start adding nodes or edges in the sidebar.
        </p>
        <p>
          If you are looking to integrate Arx-Net's parsing engine into your Python environment:
        </p>
        <pre><code>pip install arx-net networkx</code></pre>
      </div>
    </div>
  `,
  '/generation': `
    <div class="page-content fade-in">
      <h1>Graph Generation</h1>
      
      <div class="content-box">
        <h2>Syntax & Input Formats</h2>
        <p>
          Arx-Net allows you to manually input edge definitions to construct custom graphs. The parser supports multiple shorthand formats to streamline creation.
        </p>
        
        <div class="media-split-view">
          <div class="media-container">
            <img src="./edge_input_syntax.png" alt="Edge Input Syntax Laptop" />
            <div class="media-label">Laptop View</div>
          </div>
          <div class="media-container">
            <img src="./edge_input_syntax_mobile.jpeg" alt="Edge Input Syntax Mobile" />
            <div class="media-label">Mobile View</div>
          </div>
        </div>
        
        <h3>Supported Edge Formats</h3>
        <ul>
          <li><code>(A,B,5)</code> - Explicit format: Directed/Undirected edge from vertex A to B with a weight of 5.</li>
          <li><code>AB-4</code> - Compact format: Edge from A to B with a weight of -4.</li>
          <li><code>12-6</code> - Numeric format: Edge from vertex 1 to 2 with a weight of -6.</li>
          <li><code>{'A':['b',2], 'C': 'D'}</code> - Python Adjacency Dictionary: Matches standard Python graph definitions.</li>
          <li><code>[('A','B',2), ('B','C',1)]</code> - Python Edge List.</li>
        </ul>
        <p>
          <strong>Note:</strong> Edges can be defined as directed/undirected or weighted/unweighted based on the active UI checkboxes. If a Graph Name is left blank, the system assigns a sequential default tree or graph name automatically.
        </p>
      </div>

      <div class="content-box">
        <h2>Procedural Generators</h2>
        
        <h3>Random Graph Generator</h3>
        <p>
          Instead of manually defining edges, you can use the procedural generator to build massive, connected networks.
        </p>
        <ul>
          <li>Configure limits like max vertices, max edges, and weight ranges.</li>
          <li>Toggle options for <strong>Self-Loops</strong> and <strong>Duplicate Edges</strong>.</li>
          <li>Force the graph to be mathematically <strong>Connected</strong>.</li>
        </ul>

        <div class="media-split-view">
          <div class="media-container">
            <img src="./tree_generation.png" alt="Tree Generation Menu Laptop" />
            <div class="media-label">Laptop View</div>
          </div>
          <div class="media-container">
            <img src="./tree_generation_mobile.jpeg" alt="Tree Generation Menu Mobile" />
            <div class="media-label">Mobile View</div>
          </div>
        </div>

        <h3>Random Tree Generator</h3>
        <p>
          Arx-Net also features a robust tree generator capable of generating specific algorithmic tree structures:
        </p>
        <ul>
          <li><strong>Binary Search Trees (BST)</strong></li>
          <li><strong>AVL Trees</strong></li>
          <li><strong>Red-Black Trees</strong></li>
          <li><strong>B-Trees & B+ Trees</strong></li>
          <li><strong>2-3 & 2-3-4 Trees</strong></li>
        </ul>
      </div>
    </div>
  `,
  '/interactions': `
    <div class="page-content fade-in">
      <h1>UI & Interactions</h1>
      
      <div class="content-box">
        <h2>Global Controls</h2>
        <p>The top header bar provides essential global utilities for managing your workspace:</p>
        <ul>
          <li><strong>Light/Dark Mode:</strong> Switch the active theme palette.</li>
          <li><strong>Fullscreen:</strong> Expand the canvas to fill your monitor.</li>
          <li><strong>Guide / About:</strong> Review default behaviors and usage rules directly in the app.</li>
          <li><strong>Import/Export:</strong> Upload previous JSON graphs or download your current workspace to a local file.</li>
        </ul>
      </div>

      <div class="content-box">
        <h2>The Outliner</h2>
        <p>
          The Outliner acts as your workspace manager, displaying a hierarchical list of all instantiated graphs.
        </p>
        
        <div class="media-split-view">
          <div class="media-container">
            <img src="./outlier_menu.png" alt="Outliner Menu Laptop" />
            <div class="media-label">Laptop View</div>
          </div>
          <div class="media-container">
            <img src="./outlier_menu_mobile.jpeg" alt="Outliner Menu Mobile" />
            <div class="media-label">Mobile View</div>
          </div>
        </div>
        
        <ul>
          <li><strong>Double-Click:</strong> Rename a graph instance. (Names must be globally unique).</li>
          <li><strong>Focus Button:</strong> Instantly move the camera to center the target graph.</li>
          <li><strong>Right-Click Context Menu:</strong> Access actions like Delete and Duplicate. Duplicating allows you to apply new structural parameters (e.g., converting an unweighted graph into a weighted one).</li>
        </ul>
      </div>

      <div class="content-box">
        <h2>Graph Viewport</h2>
        <p>
          The central canvas is fully interactive, built natively with D3.js SVG manipulation. The viewport also features a real-time statistical overlay detailing exactly how many vertices and edges are currently rendered.
        </p>
        
        <div class="media-split-view">
          <div class="media-container">
            <video src="./graph_viewport_control.webm" autoplay loop muted playsinline></video>
            <div class="media-label">Laptop View</div>
          </div>
          <div class="media-container">
            <video src="./graph_viewport_control_mobile.mp4" autoplay loop muted playsinline></video>
            <div class="media-label">Mobile View</div>
          </div>
        </div>
        
        <ul>
          <li><strong>Left Mouse Button (LMB):</strong> Select and interact directly with vertices or edges.</li>
          <li><strong>Middle Mouse / Ctrl + LMB:</strong> Click and drag to pan the camera across the workspace.</li>
          <li><strong>Scroll Wheel:</strong> Zoom in and out of the active topology.</li>
          <li><strong>Right-Click Node Options:</strong> Access features like "Change node value", "Color this vertex", "Create new edge", "Delete this vertex", and the recursive "Delete this vertex and its subtree".</li>
        </ul>
      </div>
    </div>
  `,
  '/algorithms': `
    <div class="page-content fade-in">
      <h1>Algorithms & Visualization</h1>
      
      <div class="content-box">
        <h2>Running Algorithms</h2>
        <p>
          Arx-Net supports a wide array of classic graph algorithms. To run one, select your target graph, enter any required parameters (like a start node or sink node), and click execute.
        </p>
        
        <h3>Supported Algorithms</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
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

      <div class="content-box">
        <h2>Tree Insertion Algorithms</h2>
        <p>
          While manipulating specific structural trees like BSTs, AVLs, or B-Trees, Arx-Net implements strict algorithmic logic during dynamic node insertions to ensure mathematical integrity.
        </p>
        <ul>
          <li><strong>Binary Tree:</strong> Standard level-order Breadth-First traversal is used to find the next available child, keeping the tree structure compact.</li>
          <li><strong>Binary Search Tree (BST):</strong> Values are compared recursively against the root. Smaller values traverse the left child; larger values traverse the right child. Insertions act as new leaf nodes.</li>
          <li><strong>AVL Tree:</strong> Follows standard BST insertion, but recalculates the Balance Factor (Height Left - Height Right) for all ancestors. Unbalanced nodes trigger strict Left-Left (LL), Right-Right (RR), Left-Right (LR), or Right-Left (RL) rotations.</li>
          <li><strong>B-Tree:</strong> Search traverses down to the appropriate leaf node. If a node overfills past its maximum order after insertion, it splits, promoting the median key up to the parent. This propagates up to the root if necessary.</li>
          <li><strong>B+ Tree:</strong> Operates similarly to a B-Tree, but all data must remain at the leaf level. When a leaf splits, the median key is copied up to the parent rather than moved, preserving sequential linked access across the leaf layer.</li>
        </ul>
      </div>

      <div class="content-box">
        <h2>Real-Time Playback</h2>
        <p>
          After running an algorithm, you can click the <strong>[Visualize]</strong> link. This isolates the target graph and opens the Playback Controller.
        </p>
        
        <div class="media-split-view">
          <div class="media-container">
            <video src="./algorithm playback.webm" autoplay loop muted playsinline></video>
            <div class="media-label">Laptop View</div>
          </div>
          <div class="media-container">
            <video src="./algorithm_playback_mobile.mp4" autoplay loop muted playsinline></video>
            <div class="media-label">Mobile View</div>
          </div>
        </div>
        
        <ul>
          <li>Watch algorithms traverse nodes step-by-step.</li>
          <li>Pause, rewind, and seek through the execution timeline.</li>
          <li>Adjust the playback speed to observe complex branching at your own pace.</li>
        </ul>
      </div>

      <div class="content-box">
        <h2>Step-by-Step Explanations</h2>
        <p>
          Arx-Net doesn't just show you the answer; it shows you exactly <em>how</em> it arrived there.
        </p>
        
        <div class="media-split-view">
          <div class="media-container">
            <img src="./step_by_step_explanation.png" alt="Step-by-Step Explanation Laptop" />
            <div class="media-label">Laptop View</div>
          </div>
          <div class="media-container">
            <img src="./step_by_step_explanation.png" alt="Step-by-Step Explanation Mobile" />
            <div class="media-label">Mobile View</div>
          </div>
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
  `,
  '/python-integration': `
    <div class="page-content fade-in">
      <h1>Python Integration</h1>
      
      <div class="content-box">
        <h2>NetworkX Interoperability</h2>
        <p>
          Arx-Net includes a dedicated Python package designed to bridge the gap between our rapid topology 
          prototyping frontend and the robust, industry-standard <code>networkx</code> library.
        </p>
        
        <h3>Installation</h3>
        <p>You can easily install the required packages via pip:</p>
        <pre><code>pip install arx-net networkx</code></pre>
      </div>

      <div class="content-box">
        <h2>Example Usage</h2>
        <p>
          Below is a sample program demonstrating how to parse Arx-Net shorthand notation directly into a NetworkX graph object:
        </p>
        
        <div style="position: relative;">
          <button class="copy-btn" id="copyBtn" title="Copy Code">
            <i data-lucide="copy" style="width:18px;height:18px"></i>
          </button>
          <pre><code id="codeSnippet">import arx_net
import networkx as nx

# Parse the Arx-Net shorthand notation
adjList = arx_net.parse_edges("AB7, AA6, BA9, AC5, AD3, BC4, BE6, CD2, CF8, DE5, DG7, EE2, EF3, EH4, FG6, FI7, GH2, HI5, HJ9, IJ4")

# Convert to standard edge list type (directly supported by networkx)
edges = arx_net.convert_type(adjList, "edge")

# Initialize graph
G = nx.Graph() # or nx.DiGraph() if the graph is directed
G.add_weighted_edges_from(edges)

# Run algorithms via NetworkX
bfs_nodes = list(nx.bfs_tree(G, source="A").nodes())
print(bfs_nodes)</code></pre>
        </div>

        <p>
          <strong>Format Conversion:</strong> The <code>arx_net.convert_type</code> method seamlessly translates 
          between adjacency lists, edge lists, and adjacency matrices depending on your backend requirements.
        </p>
      </div>
    </div>
  `
};

const mainContent = document.getElementById('main-content');
const navLinks = document.querySelectorAll('.nav-link');

function renderRoute() {
  let hash = window.location.hash.replace('#', '') || '/';
  if (!routes[hash]) hash = '/';
  
  mainContent.innerHTML = routes[hash];
  
  // Create icons for dynamically added content
  lucide.createIcons();

  // Handle active links
  navLinks.forEach(link => {
    if (link.getAttribute('data-route') === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Ensure videos autoplay after being injected
  const videos = mainContent.querySelectorAll('video');
  videos.forEach(video => {
    video.load();
    video.play().catch(e => console.log('Autoplay prevented:', e));
  });

  // Bind copy button if it exists
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeSnippet = document.getElementById('codeSnippet').innerText;
      navigator.clipboard.writeText(codeSnippet);
    });
  }
}

// Initial render and hash change listener
window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  renderRoute();
});

// Sidebar Logic
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const menuIcon = document.getElementById('menuIcon');
let isSidebarOpen = false;

function toggleSidebar() {
  isSidebarOpen = !isSidebarOpen;
  if (isSidebarOpen) {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    menuToggle.innerHTML = '<i data-lucide="x"></i>';
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
  }
  lucide.createIcons();
}

function closeSidebar() {
  if (isSidebarOpen) toggleSidebar();
}

menuToggle.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', closeSidebar);

navLinks.forEach(link => {
  link.addEventListener('click', closeSidebar);
});
