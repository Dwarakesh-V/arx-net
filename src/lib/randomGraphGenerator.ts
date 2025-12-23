import { indexToLabel } from './graphUtils';
import type { Node, Edge } from '../types';

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

    // --- 1. Generate Nodes ---
    // We add x, y coordinates here immediately so they don't stack at (0,0)
    const nodes: Node[] = Array.from({ length: vertexCount }, (_, i) => ({
        id: indexToLabel(i),
        x: 300 + (Math.random() - 0.5) * 300, // Random X centered around 300
        y: 200 + (Math.random() - 0.5) * 200  // Random Y centered around 200
    }));

    // Helper map to check duplicates
    const edgeSet = new Set<string>();
    const edges: Edge[] = [];
    const vertices = nodes.map(n => n.id);

    // --- Validation Logic for Max Edges ---
    let maxEdges = 0;
    if (allowSelfLoops) {
        maxEdges = isDirected ? vertexCount * vertexCount : (vertexCount * (vertexCount + 1)) / 2;
    } else {
        maxEdges = isDirected ? vertexCount * (vertexCount - 1) : (vertexCount * (vertexCount - 1)) / 2;
    }
    
    // Cap edge count if duplicates are not allowed
    let finalEdgeCount = edgeCount;
    if (!allowDuplicates && edgeCount > maxEdges) finalEdgeCount = maxEdges;


    // --- 2. Generation Logic: Spanning Tree (Connectivity) ---
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
            
            const key = isDirected ? `${u}->${v}` : `${u}-${v}`; // Unique Key
            edgeSet.add(key);
            
            edges.push({
                id: key,
                source: u,
                target: v,
                weight
            });
        }
    }

    // --- 3. Generation Logic: Random Edges ---
    let attempts = 0;
    // We add a safety limit to attempts to prevent infinite loops on dense graphs
    while (edges.length < finalEdgeCount && attempts < finalEdgeCount * 20) {
        attempts++;
        const u = vertices[Math.floor(Math.random() * vertexCount)];
        const v = vertices[Math.floor(Math.random() * vertexCount)];
        
        if (!allowSelfLoops && u === v) continue;

        // Check Duplicates
        // For undirected, A-B is same as B-A
        const forwardKey = isDirected ? `${u}->${v}` : `${u}-${v}`;
        const reverseKey = isDirected ? `${v}->${u}` : `${v}-${u}`;

        if (!allowDuplicates) {
            if (edgeSet.has(forwardKey)) continue;
            if (!isDirected && edgeSet.has(reverseKey)) continue;
        }

        const weight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;
        
        edgeSet.add(forwardKey);
        edges.push({
            id: forwardKey + (allowDuplicates ? `-${attempts}` : ''), // Ensure ID uniqueness if duplicates allowed
            source: u,
            target: v,
            weight
        });
    }

    return { nodes, edges };
};