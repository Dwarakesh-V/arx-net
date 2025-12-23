    // Define what a Node looks like (based on your usage)
    export interface Node {
    id: string;
    x: number;
    y: number;
    // Add other properties you use, e.g., color, label
    }

    // Define what a Link/Edge looks like
    export interface Edge {
    source: string | Node; // D3 sometimes converts string IDs to object references
    target: string | Node;
    weight?: number;
    id: string;
    }

    // Define the Graph object that sits in your "availableGraphs" array
    export interface GraphData {
    id: number; // unique ID
    name: string;
    nodes: Node[];
    edges: Edge[];
    isDirected: boolean;
    isWeighted: boolean;
    // view state specific to this graph window
    x?: number;
    y?: number;
    isVisible: boolean;
    }