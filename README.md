# Arx Net — Graph Visualization & Algorithm Simulator

Arx Net is an interactive graph visualization tool built using **React**, **TypeScript**, and **D3.js**.  
It allows users to create, edit, visualize, and analyze directed or undirected graphs using classic graph algorithms.


## Features

### Graph Creation
- Create custom graphs using:
  - Graph name  
  - Vertices  
  - Edges (supports weighted/unweighted, directed/undirected)  
- Random graph generator  
- Validation for duplicates, self-loops, and multigraph settings  

### Graph Visualization
- D3.js–powered interactive SVG rendering  
- Zoom, pan, drag, and auto-centering  
- Snap-to-grid movement  
- Multi-graph window layout (4-grid and 9-grid view)  
- Editable graph titles  
- Outliner to manage all created graphs  

### Graph Algorithms Included
All algorithms are rewritten in TypeScript and return clean, structured results for UI rendering:

- **BFS (Breadth-First Search)**
- **DFS (Depth-First Search)**
- **Dijkstra’s Algorithm**
- **Bellman–Ford Algorithm**
- **Floyd–Warshall**
- **MST (Prim’s Algorithm)**
- **Topological Sort**
- **Strongly Connected Components (Kosaraju)**
- **Biconnected Components (Tarjan)**


## Project Structure



## 🧰 Tech Stack

| Category | Technology |
|----------|------------|
| UI Framework | **React + TypeScript (TSX)** |
| Graph Rendering | **D3.js** |
| State Management | React Hooks |
| Build Tool | **Vite** |
| Styling | CSS / Modules |
| Algorithms | Pure TypeScript modules |

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/arx-net-react.git

cd arx-net-react

# Install dependencies
npm install

# Start development server
npm run dev
```
Your app will be available at:

http://localhost:5173/

## Development Notes

* No prompt() or alert() — all user input handled through React UI.
* No direct DOM manipulation — everything uses React state or D3 selections.
* Algorithms return plain objects ({ order: [...] }, { distances: ... }), making the UI fully independent of the logic.
* Codebase is modular, strongly typed, and easy to extend.
* Graph logic (layout, rendering, algorithms) is fully separated from UI components.

## License
MIT License © 2025 Arx Net

If you find this project helpful, please star the repository!

## Contributing

Pull Requests are welcome!

You may contribute by:
* Adding new graph algorithms
* Improving visual layouts
* Extending D3 rendering features
* Enhancing performance
* Adding themes or exporting features

## Contributors

* [@Dwarakesh V](https://github.com/Dwarakesh-V)
* [@Shyam Sundar Raju](https://github.com/Shyam-Sundar-Raju)
* [@Sarigasini M](https://github.com/Sariga-2005)