const aboutBtn = document.getElementById('about');
const aboutDiv = document.getElementById('aboutDiv');
const fullScreenBtn = document.getElementById('toggleFullScreen');
const toggleModeButton = document.getElementById('toggleLightMode');
const uploadButton = document.getElementById('uploadGraphs');
const downloadButton = document.getElementById('downloadGraphs');
const customizeButton = document.getElementById('customizeButton');
const customizeRandom = document.getElementById('customizeRandom');

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
const generateButton = document.getElementById('generateStruct');
const generateRandomButton = document.getElementById('generateRandomButton');
const generateSimpleButton = document.getElementById('generateSimpleButton');
const generateComplexButton = document.getElementById('generateComplexButton');

const treeTypeSelect = document.getElementById('treeTypeSelect')
const graphOptions = document.getElementById('goptions')
const minMaxRec = document.getElementById('minMaxRec')

const selfLoops = document.getElementById('selfLoops');
const duplicateEdges = document.getElementById('duplicateEdges');
const isDirected = document.getElementById('directed');
const isWeighted = document.getElementById('weighted');
const isTypeGraph = document.getElementById('genTypeGraph')
const isTypeTree = document.getElementById('genTypeTree')

const outliner = document.querySelector('.outliner'); // Outliner - Contains created graphs

const showHideAll = document.getElementById('showHideAll'); // Show/Hide All graphs button
let showHideAllGraphs = true; // Show/Hide All graphs state

const clearAll = document.getElementById('clearAll'); // Clear All graphs button

const resultLog = document.getElementById('resultLog'); // Explanations are displayed here

var primaryBG = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
var edgeColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-color').trim();
var edgeHoverColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-hover-color').trim();
var nodeColor = getComputedStyle(document.documentElement).getPropertyValue('--node-color').trim();
var nodeBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--node-border-color').trim();
var nodeHoverColor = getComputedStyle(document.documentElement).getPropertyValue('--node-hover-color').trim();
var nodeLabelColor = getComputedStyle(document.documentElement).getPropertyValue('--node-label-color').trim();
var edgeWeightColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-weight-color').trim();
var gridLineColor = getComputedStyle(document.documentElement).getPropertyValue('--grid-line-color').trim();
var dragNodeColor = getComputedStyle(document.documentElement).getPropertyValue('--drag-node-color').trim();
var nodeVisitColor = getComputedStyle(document.documentElement).getPropertyValue('--node-visited-color').trim();
var edgeEvalColor = getComputedStyle(document.documentElement).getPropertyValue('--edge-eval-color').trim();
var errorColor = getComputedStyle(document.documentElement).getPropertyValue('--error-color').trim();

const disColors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
    '#aa24d3', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
    '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
    '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
]; // Colors will start repeating after 20 SCCs

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
    { name: 'maxFlow', text: 'Max flow', title: 'Maximum Flow (Ford-Fulkerson/Edmonds Karp)' }
];

const algoGraphs = new Set();

// Drawing grid
const gridSize = 40; // Defines the distance between lines

// Graph management variables
let graphCount = 0;
const availableGraphs = new Set();
const graphMap = new Map();

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

const PLAY_ICON = `
<svg
    id="playIcon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-0.5 0 8 8"
    style="width:1rem;height:1rem"
>
    <g>
        <g transform="translate(-427 -3765)">
            <g transform="translate(56 160)">
                <polygon points="371 3605 371 3613 378 3609"/>
            </g>
        </g>
    </g>
</svg>
`;

const PAUSE_ICON = `
<svg
    id="pauseIcon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-1 0 8 8"
    style="width:1rem;height:1rem"
>
    <g>
        <g transform="translate(-67 -3765)">
            <g transform="translate(56 160)">
                <path d="M11 3613H13V3605H11V3613ZM15 3613H17V3605H15V3613Z"/>
            </g>
        </g>
    </g>
</svg>
`;

class GraphPlaybackController {
    constructor(svg, totalSteps, container, callbacks = {}) {
        this.svg = svg;
        this.totalSteps = totalSteps;
        this.container = container;
        this.callbacks = callbacks;

        // Internal State
        this.currentStep = 0;
        this.speed = 1;
        this.isPlaying = true;

        // DOM Elements
        this.controlBar = null;
        this.timeline = null;
        this.playPauseBtn = null;

        this.#buildUI();
    }

    #buildUI() {
        this.controlBar = document.createElement("div");
        this.controlBar.className = "playback-controls";

        // Apply configurable positioning
        Object.assign(this.controlBar.style, this.position);

        this.playPauseBtn = document.createElement("button");
        this.playPauseBtn.className = "playback-btn";
        this.playPauseBtn.innerHTML = PAUSE_ICON;
        this.playPauseBtn.title = "Pause";

        this.playPauseBtn.addEventListener("click", () => {
            this.togglePlayState(!this.isPlaying);

            if (this.isPlaying && this.callbacks.onPlay) {
                this.callbacks.onPlay();
            } else if (!this.isPlaying && this.callbacks.onPause) {
                this.callbacks.onPause();
            }
        });

        const endBtn = document.createElement("button");
        endBtn.className = "playback-btn";
        endBtn.innerHTML = "&#9724;"; // Square icon
        endBtn.title = "End Animation";
        endBtn.addEventListener("click", () => {
            this.callbacks.onEnd?.();
            this.destroy();
        });

        this.timeline = document.createElement("input");
        this.timeline.type = "range";
        this.timeline.className = "playback-timeline";
        this.timeline.min = 0;
        this.timeline.max = this.totalSteps;
        this.timeline.value = 0;

        this.timeline.addEventListener("input", (e) => {
            this.currentStep = parseInt(e.target.value, 10);
            this.callbacks.onSeek?.(this.currentStep);
        });

        const speedSelect = document.createElement("select");
        speedSelect.className = "playback-speed";

        [0.25, 0.5, 1, 1.5, 2].forEach(speed => {
            const option = document.createElement("option");
            option.value = speed;
            option.textContent = `${speed}x`;
            if (speed === 1) option.selected = true;
            speedSelect.appendChild(option);
        });

        speedSelect.addEventListener("change", (e) => {
            this.speed = parseFloat(e.target.value);
            this.callbacks.onSpeedChange?.(this.speed);
        });

        this.controlBar.append(
            this.playPauseBtn,
            this.timeline,
            speedSelect,
            endBtn
        );

        this.container.appendChild(this.controlBar);
    }

    togglePlayState(isNowPlaying) {
        this.isPlaying = isNowPlaying;

        if (this.playPauseBtn) {
            this.playPauseBtn.innerHTML = this.isPlaying
                ? PAUSE_ICON
                : PLAY_ICON;
            this.playPauseBtn.title = this.isPlaying ? "Pause" : "Play";
        }
    }

    updateTimeline(step) {
        this.currentStep = step;
        if (this.timeline) this.timeline.value = step;
    }

    destroy() {
        algoGraphs.delete(this.container);
        this.isPlaying = false;

        if (this.controlBar) {
            this.controlBar.remove();
            this.controlBar = null;
        }

        this.svg?.select("#interaction-blocker").remove();
        resultLog.innerHTML = genTheory;
    }
}

let isMobile = window.innerWidth <= 768; // Mobile device support modification

window.addEventListener("resize", () => {
    isMobile = window.innerWidth <= 768;
});