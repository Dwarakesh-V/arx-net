import type { Edge } from '../types';

// --- Parsing Logic ---

export const parseEdges = (edgesInput: string, isDirected: boolean = true): Edge[] => {
    // 1. Explicitly type the result of the map as (Edge | null)[]
    const edgesRaw = edgesInput.split(',').map((edge): Edge | null => {
        edge = edge.trim();

        // Validate formats: 'AB5' or '(A_B_5)'
        const simpleFormat = /^([a-zA-Z0-9]{2})(\d*)$/; 
        const parenFormat = /^\(([a-zA-Z0-9]+)_([a-zA-Z0-9]+)(?:_(\d+))?\)$/; 

        let source: string, target: string, weight: number;

        if (simpleFormat.test(edge)) {
            const match = edge.match(simpleFormat);
            if (!match) return null;
            source = match[1][0];
            target = match[1][1];
            weight = parseFloat(match[2]);
        } else if (parenFormat.test(edge)) {
            const match = edge.match(parenFormat);
            if (!match) return null;
            source = match[1];
            target = match[2];
            weight = parseFloat(match[3]);
        } else if (edge.length === 1) {
            // Single node edge case
            return null; 
        } else {
            console.warn("Invalid edge format: " + edge);
            return null;
        }

        if (isNaN(weight)) weight = 1;

        // 2. Cast the object to 'Edge' so the map array is typed correctly
        return { 
            source, 
            target, 
            weight, 
            id: `${source}-${target}` 
        } as Edge;

    }).filter((edge): edge is Edge => edge !== null);

    // Remove duplicates
    const edgeMap = new Map<string, Edge>();
    for (const edge of edgesRaw) {
        // D3 might expect objects, but we currently have strings.
        // We cast to string to satisfy TS for the key generation.
        const s = edge.source as string;
        const t = edge.target as string;
        
        const key = `${s}_${t}`;
        edgeMap.set(key, edge); 
        
        if (!isDirected) {
            const reverseKey = `${t}_${s}`;
            if (edgeMap.has(reverseKey)) edgeMap.delete(reverseKey);
        }
    }
    
    return Array.from(edgeMap.values());
};

export const stringifyEdges = (edges: Edge[]) => {
    return edges
        .map(e => {
            // Handle both string IDs and D3 Node objects safety
            const s = typeof e.source === 'object' ? e.source.id : e.source;
            const t = typeof e.target === 'object' ? e.target.id : e.target;
            return `(${s}_${t}_${e.weight})`;
        })
        .join(', ');
};

export const indexToLabel = (index: number) => {
    let label = '';
    while (index >= 0) {
        label = String.fromCharCode(97 + (index % 26)) + label;
        index = Math.floor(index / 26) - 1;
    }
    return label.toUpperCase();
};

export const smoothFunction = (x: number, k = 0.02, c = 275) => {
    const exponent = -k * (x - c);
    const denominator = 1 + Math.exp(exponent);
    return 10 - (2.4 / denominator);
};