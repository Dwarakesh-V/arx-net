const aboutBtn = document.getElementById('about');
const genBtn = document.getElementById('genExplain');
const aboutDiv = document.getElementById('aboutDiv');
const fullScreenBtn = document.getElementById('toggleFullScreen');

const cgb = document.getElementById('createGraphButton'); // Create graph button
const graphGenMenu = document.getElementById('sourceInput')

const graphInputField = document.getElementById('edges'); // Edge list
const graphInputVertices = document.getElementById('vertices'); // Vertices
const connected = document.getElementById('connectedGraph'); // Connected graph checkbox
const minWeight = document.getElementById('minWeight'); // Minimum weight input
const maxWeight = document.getElementById('maxWeight'); // Maximum weight input
const vertexInput = document.getElementById('numNodes'); // Number of vertices input
const edgeInput = document.getElementById('numEdges'); // Number of edges input
const edgeLabel = document.getElementById('edgeCountLabel');
const generateRandomGraphButton = document.getElementById('generateRandomGraph'); // Generate random graph button
const generateRandomTreeButton = document.getElementById('generateRandomTree');
const treeTypeSelect = document.getElementById('treeTypeSelect')
const graphOptions = document.getElementById('goptions')
const minMaxRec = document.getElementById('minMaxRec')

const selfLoops = document.getElementById('selfLoops');
const duplicateEdges = document.getElementById('duplicateEdges');
const isDirected = document.getElementById('directed');

const outliner = document.querySelector('.outliner'); // Outliner - Contains created graphs

const showHideAll = document.getElementById('showHideAll'); // Show/Hide All graphs button
let showHideAllGraphs = true; // Show/Hide All graphs state

const clearAll = document.getElementById('clearAll'); // Clear All graphs button

const resultLog = document.getElementById('resultLog'); // Explanations are displayed here

var edgeColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-color').trim();
var edgeHoverColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-hover-color').trim();
var nodeColor = getComputedStyle(document.documentElement).getPropertyValue('--node-color').trim();
var nodeHoverColor = getComputedStyle(document.documentElement).getPropertyValue('--node-hover-color').trim();
var nodeLabelColor = getComputedStyle(document.documentElement).getPropertyValue('--node-label-color').trim();
var edgeWeightColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-weight-color').trim();
var gridLineColor = getComputedStyle(document.documentElement).getPropertyValue('--grid-line-color').trim();
var dragNodeColor = getComputedStyle(document.documentElement).getPropertyValue('--drag-node-color').trim();

// Available methods
const algorithms = [
    { name: 'bfs', text: 'BFS', title: 'Breadth-First Search' },
    { name: 'dfs', text: 'DFS', title: 'Depth-First Search' },
    { name: 'dijkstra', text: 'Dijkstra\'s', title: 'Dijkstra\'s Shortest Path' },
    { name: 'floydWarshall', text: 'Floyd Warshall', title: 'Floyd-Warshall Algorithm' },
    { name: 'bellmanFord', text: 'Bellman Ford', title: 'Bellman-Ford Algorithm' },
    { name: 'mst', text: 'MST', title: 'Minimum Spanning Tree' },
    { name: 'topologicalSort', text: 'Topological Sort', title: 'Topological Sorting' },
    { name: 'scc', text: 'SCC', title: 'Strongly Connected Components' },
    { name: 'bcc', text: 'BCC', title: 'Biconnected Components' }
];

// Drawing grid
const gridSize = 40; // Defines the distance between lines

// Graph management variables
let graphCount = 0;
let availableGraphs = [];

class FloatingMenu { /* Resuable floating menu that works like browser right click menu */
    constructor(menu) {
        if (typeof menu === "string") {
            this.menu = document.querySelector(menu);
        } else {
            this.menu = menu;
        }

        if (!this.menu) {
            throw new Error("Floating menu element not found.");
        }

        this.menu.classList.add("floating-menu");
        this.menu.style.position = "fixed";
        this.menu.style.display = "none";

        this.visible = false;

        this.#setupEvents();
    }

    #setupEvents() {
        document.addEventListener("mousedown", (e) => {
            if (!this.visible) return;

            if (!this.menu.contains(e.target)) {
                this.hide();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                this.hide();
            }
        });

        window.addEventListener("resize", () => {
            if (this.visible) {
                this.#keepInsideViewport();
            }
        });

        window.addEventListener("scroll", () => {
            if (this.visible) {
                this.#keepInsideViewport();
            }
        });
    }

    show(eventOrX, y = null) {
        let x;

        if (eventOrX instanceof MouseEvent) {
            x = eventOrX.clientX;
            y = eventOrX.clientY;

            // Prevent browser context menu if desired
            eventOrX.preventDefault();
        } else {
            x = eventOrX;
        }

        this.menu.style.display = "block";

        // Position first
        this.menu.style.left = `${x}px`;
        this.menu.style.top = `${y}px`;

        this.#position(x, y);

        this.visible = true;
    }

    hide() {
        this.menu.style.display = "none";
        this.visible = false;
    }

    toggle(eventOrX, y = null) {
        if (this.visible) {
            this.hide();
        } else {
            this.show(eventOrX, y);
        }
    }

    #position(x, y) {
        const rect = this.menu.getBoundingClientRect();

        let left = x;
        let top = y;

        const padding = 4;

        // Right edge
        if (left + rect.width > window.innerWidth - padding) {
            left = window.innerWidth - rect.width - padding;
        }

        // Bottom edge
        if (top + rect.height > window.innerHeight - padding) {
            top = window.innerHeight - rect.height - padding;
        }

        // Left edge
        if (left < padding) {
            left = padding;
        }

        // Top edge
        if (top < padding) {
            top = padding;
        }

        this.menu.style.left = `${left}px`;
        this.menu.style.top = `${top}px`;

        this.lastX = left;
        this.lastY = top;
    }

    #keepInsideViewport() {
        this.#position(this.lastX, this.lastY);
    }
}

const isMobile = window.innerWidth <= 768; // Mobile device support modification