import { indexToLabel } from './graphUtils';

interface RandomGenOptions {
    vertexCount: number;
    edgeCount: number;
    allowDuplicates: boolean;
    ensureConnected: boolean;
    allowSelfLoops: boolean;
    minWeight: number;
    maxWeight: number;
    isDirected: boolean;
}

export const generateRandomGraphData = (options: RandomGenOptions) => {
    const { 
        vertexCount, edgeCount, allowDuplicates, ensureConnected, 
        allowSelfLoops, minWeight, maxWeight, isDirected 
    } = options;

    if (vertexCount <= 0) throw new Error("Vertex count must be > 0");

    // --- Validation Logic (Copied from your script) ---
    let maxEdges = 0;
    if (allowSelfLoops) {
        maxEdges = isDirected ? vertexCount * vertexCount : (vertexCount * (vertexCount + 1)) / 2;
    } else {
        maxEdges = isDirected ? vertexCount * (vertexCount - 1) : (vertexCount * (vertexCount - 1)) / 2;
    }

    // Adjust edge count logic...
    let finalEdgeCount = edgeCount;
    if (!allowDuplicates && edgeCount > maxEdges) finalEdgeCount = maxEdges;

    const vertices = Array.from({ length: vertexCount }, (_, i) => indexToLabel(i));
    const edges = new Set<string>();
    const edgeList: any[] = [];

    // --- Generation Logic ---
    
    // 1. Spanning Tree (Connectivity)
    if (ensureConnected && vertexCount > 1) {
        const shuffled = [...vertices];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        for (let i = 1; i < shuffled.length; i++) {
            const u = shuffled[i - 1];
            const v = shuffled[i];
            const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
            
            const key = `${u}_${v}`;
            edges.add(key);
            edgeList.push({ source: u, target: v, weight });
        }
    }

    // 2. Random Edges
    let attempts = 0;
    while (edgeList.length < finalEdgeCount && attempts < finalEdgeCount * 10) {
        attempts++;
        const u = vertices[Math.floor(Math.random() * vertexCount)];
        const v = vertices[Math.floor(Math.random() * vertexCount)];
        
        if (!allowSelfLoops && u === v) continue;

        const key = `${u}_${v}`;
        const reverseKey = `${v}_${u}`;

        if (!allowDuplicates) {
            if (isDirected && edges.has(key)) continue;
            if (!isDirected && (edges.has(key) || edges.has(reverseKey))) continue;
        }

        const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
        edges.add(key);
        edgeList.push({ source: u, target: v, weight });
    }

    return {
        rawVertices: vertices.join(', '),
        // We return the raw string so GraphGenerator can populate the input box
        rawEdges: edgeList.map(e => `(${e.source}_${e.target}_${e.weight})`).join(', ') 
    };
};