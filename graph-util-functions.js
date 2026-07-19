/* Applicable methods */
function filterAlgorithms(algorithms, directed, weighted) {
    // Filter the algorithms based on the graph properties
    const applicableAlgorithms = algorithms.filter(algorithm => {
        if (!directed) {
            // If the graph is undirected, exclude algorithms that only work on directed graphs
            if (algorithm.name === 'topologicalSort' || algorithm.name === 'scc' || algorithm.name === 'fordFulkerson' || algorithm.name === 'edmondsKarp' || algorithm.name === 'dinic' || algorithm.name === 'pushRelabel') {
                return false;
            }
        }
        if (directed) {
            if (algorithm.name === 'mst') {
                // MST is not applicable for directed graphs
                return false;
            }
        }
        if (!weighted) {
            // If the graph is unweighted, exclude algorithms that require weighted graphs
            if (algorithm.name === 'dijkstra' || algorithm.name === 'floydWarshall' || algorithm.name === 'bellmanFord') {
                return false;
            }
        }
        return true;
    });
    return applicableAlgorithms;
}

function handleAlgorithmClick(algorithm, container, svgElement, svg, nodes, edges, arrowId, edgesRaw, directed, weighted, displayName, methodsElement) {
    const resultContainer = document.createElement('p');
    resultContainer.style.width = "calc(100% - 30px)";
    resultContainer.style.margin = "0px 15px";
    let result = null;
    let label = '';

    const getSource = (promptText) => {
        const input = prompt(promptText);
        return input ? input.toUpperCase() : null;
    };

    const av = document.createElement("a");
    av.href = "javascript:void(0)";
    av.textContent = "[Visualize]";
    av.style.color = "#ff8a65";
    av.style.textDecoration = "underline";
    av.style.cursor = "pointer";

    let isMST = false;
    let kruskals; // For extra visualization for Prim's and Kruskal's
    let isSCC = false;
    let kosaraju; // For extra visualization of Kosaraju's and Tarjan's
    let isMaxFlow = false;
    let edmonds; // For extra visualization of Ford Fulkerson's and Edmond Karp's

    switch (algorithm.name) {
        case 'bfs': {
            const source = getSource("Enter source vertex");
            if (!source) break;

            result = bfs(edgesRaw, source, directed);

            av.onclick = () => {
                visualizeBFS(displayName, source, container, nodes, edges, svg, arrowId, directed);
            };

            label = `BFS on ${displayName} with ${source} as source node: `;
            break;
        }
        case 'dfs': {
            const source = getSource("Enter source vertex");
            result = dfs(edgesRaw, source || undefined, directed);

            av.onclick = () => {
                visualizeDFS(displayName, source, container, nodes, edges, svg, arrowId, directed);
            };

            label = `DFS on ${displayName} with ${source} as source node:`;
            break;
        }
        case 'dijkstra': {
            const source = getSource("Enter source vertex");
            if (!source) break;
            result = dijkstra(edgesRaw, source, nodes, directed);

            av.onclick = () => {
                visualizeDijkstra(displayName, source, container, nodes, edges, svg, arrowId, directed);
            };

            label = `Dijkstra's on ${displayName} with ${source} as source node: <br> <br>`;
            break;
        }
        case 'floydWarshall': {
            result = floydWarshall(edgesRaw, directed);

            av.onclick = () => {
                visualizeFloydWarshall(displayName, "", container, nodes, edges, svg, arrowId, directed);
            };

            label = `Floyd Warshall on ${displayName}: `;
            break;
        }
        case 'bellmanFord': {
            const source = getSource("Enter source vertex");
            if (!source) break;
            result = bellmanFord(edgesRaw, source, nodes, directed);

            av.onclick = () => {
                visualizeBellmanFord(displayName, source, container, nodes, edges, svg, arrowId, directed);
            };

            label = `Bellman Ford on ${displayName} with ${source} as source node: <br> <br>`;
            break;
        }
        case 'mst': {
            result = "Kruskal<hr>" + kruskalMST(edgesRaw,weighted,displayName) + "<br><br>Prim<hr>" + primMST(edgesRaw,weighted,displayName) + "<br>";
            label = `Generated MST for ${displayName}. `;

            isMST = true;
            kruskals = document.createElement("a");
            kruskals.href = "javascript:void(0)";
            kruskals.textContent = "[Visualize Kruskal]";
            kruskals.style.color = "#ff8a65";
            kruskals.style.textDecoration = "underline";
            kruskals.style.cursor = "pointer";

            kruskals.onclick = () => {
                visualizeMSTKruskal(displayName, container, nodes, edges, svg, arrowId);
            };

            av.textContent = "[Visualize Prim]"
            av.onclick = () => {
                visualizeMSTPrim(displayName, container, nodes, edges, svg, arrowId);
            };

            break;
        }
        case 'topologicalSort': {
            result = topologicalSort(edgesRaw);

            av.onclick = () => {
                visualizeTopologicalSort(displayName, container, nodes, edges, svg, arrowId, directed);
            };

            label = `Topological Sort for ${displayName}: `;
            break;
        }
        case 'scc': {
            let tarjanRes = tarjanSCC(edgesRaw)
            if (tarjanRes != null) {
                result = "Kosaraju<hr>" + kosarajuSCC(edgesRaw) + "<br><br>Tarjan<hr>" + tarjanRes + "<br>";
            }

            isSCC = true;
            kosaraju = document.createElement("a");
            kosaraju.href = "javascript:void(0)";
            kosaraju.textContent = "[Visualize Kosaraju's]";
            kosaraju.style.color = "#ff8a65";
            kosaraju.style.textDecoration = "underline";
            kosaraju.style.cursor = "pointer";

            kosaraju.onclick = () => {
                visualizeSCCKosaraju(displayName, container, nodes, edges, svg, arrowId, directed);
            };

            av.textContent = "[Visualize Tarjan's]"
            av.onclick = () => {
                visualizeSCCTarjan(displayName, container, nodes, edges, svg, arrowId, directed);
            };

            label = `SCCs' of ${displayName} <br>`;
            break;
        }
        case 'bcc': {
            result = BiconnectedComponents(edgesRaw);

            av.textContent = "[Visualize Hopcroft-Tarjan]";
            av.onclick = () => {
                visualizeBCC(displayName, container, nodes, edges, svg, arrowId, directed);
            };

            label = `BCCs' through ${displayName}: `;
            break;
        }
        case 'maxFlow': {
            const source = getSource("Enter source vertex");
            const sink = getSource("Enter sink vertex");
            let ffres = fordFulkerson(edgesRaw, source, sink, weighted)
            if (ffres != null) {
                result = "Ford fulkerson<hr>" + ffres + "<br><br>Edmonds Karp<hr>" + edmondsKarp(edgesRaw, source, sink, weighted) + "<br>";
            }

            isMaxFlow = true;
            edmonds = document.createElement("a");
            edmonds.href = "javascript:void(0)";
            edmonds.textContent = "[Visualize Edmond Karp]";
            edmonds.style.color = "#ff8a65";
            edmonds.style.textDecoration = "underline";
            edmonds.style.cursor = "pointer";
            edmonds.onclick = () => {
                visualizeEdmondsKarp(displayName, source, sink, container, nodes, edges, svg, arrowId, directed);
            }

            av.textContent = "[Visualize Ford Fulkerson]";
            av.onclick = () => {
                visualizeFordFulkerson(displayName, source, sink, container, nodes, edges, svg, arrowId, directed);
            };

            label = `Max flow algorithms on ${displayName} <br>`;
            break;
        }
        default:
            alert("Algorithm not implemented.");
            return;
    }

    if (result !== null) {
        resultContainer.innerHTML = `<span style="color: #ff8a65;">${label}</span> ${result} `;
        resultContainer.appendChild(av);
        if (isMST) {
            const tn = document.createTextNode(" ");
            resultContainer.append(tn);
            resultContainer.append(kruskals);
        } else if (isSCC) {
            const tn = document.createTextNode(" ");
            resultContainer.append(tn);
            resultContainer.append(kosaraju);
        } else if (isMaxFlow) {
            const tn = document.createTextNode(" ");
            resultContainer.append(tn);
            resultContainer.append(edmonds);
        }
        const brtag = document.createElement("br");
        methodsElement.appendChild(resultContainer);
        methodsElement.appendChild(brtag);
        methodsElement.appendChild(brtag);
        methodsElement.style.display = 'block';
        const meHeight = methodsElement.offsetHeight;
        svgElement.style.height = `calc(100% - ${meHeight}px)`;
        methodsElement.scrollTop = methodsElement.scrollHeight;
    } else {
        resultContainer.remove();
    }
}

/* Parse edges functionality */
// Parse edges input into an array of edge objects
function parseEdges(edgesInput, directed = true) {
    const trimmed = edgesInput.trim();
    let edges;

    if (trimmed.startsWith('{')) {
        edges = parsePythonAdjacencyDict(trimmed, directed);
    } else if (trimmed.startsWith('[')) {
        const inner = stripOuter(trimmed, '[', ']');
        const looksLikeTupleList = inner === '' || tokeniseTopLevel(inner).some(t => t.startsWith('('));
        edges = looksLikeTupleList
            ? parsePythonEdgeList(trimmed, directed)
            : parseCompactEdges(trimmed, directed);
    } else {
        edges = parseCompactEdges(trimmed, directed);
    }

    return finalizeVertexTypes(edges);
}

function finalizeVertexTypes(edges) {
    return edges.map(edge => {
        const out = Object.assign({}, edge);
        if (Array.isArray(out.source)) {
            out.sourceKeys = out.source;
            out.source = out.source.join(',');
        }
        if (Array.isArray(out.target)) {
            out.targetKeys = out.target;
            out.target = out.target.join(',');
        }
        return out;
    });
}

function tokeniseTopLevel(input, delimiter = ',') {
    const result = [];
    let depth = 0;
    let current = '';
    for (const char of input) {
        if (char === '(' || char === '[' || char === '{') depth++;
        if (char === ')' || char === ']' || char === '}') depth--;
        if (char === delimiter && depth === 0) {
            if (current.trim()) result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) result.push(current.trim());
    return result;
}

function stripOuter(s, open, close) {
    s = s.trim();
    if (s.startsWith(open) && s.endsWith(close)) return s.slice(1, -1).trim();
    return s;
}

function parseValueList(token) {
    if (token.startsWith('[') && token.endsWith(']')) {
        const inner = stripOuter(token, '[', ']');
        if (!inner) return [];
        return tokeniseTopLevel(inner).map(parseValue);
    }
    if (token.includes('|')) {
        return token.split('|').map(v => parseValue(v));
    }
    return null;
}

function parseValue(token) {
    token = token.trim();
    if ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))) {
        return token.slice(1, -1);
    }
    const list = parseValueList(token);
    if (list !== null) return list;
    if (token !== '' && !isNaN(token)) return parseFloat(token);
    return token;
}

function parseNode(token) {
    token = token.trim();
    if ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))) {
        return token.slice(1, -1);
    }
    const list = parseValueList(token);
    if (list !== null) return list;
    return token; // bare identifier or integer
}

function parseWeight(token) {
    if (token === undefined || token === null) return 1;
    const w = parseFloat(token.trim());
    return isNaN(w) ? 1 : w;
}

function parseNeighbourEntry(entry) {
    entry = entry.trim();
    if (entry.startsWith('(')) {
        const inner = stripOuter(entry, '(', ')');
        const parts = tokeniseTopLevel(inner);
        if (parts.length >= 2) {
            return { target: parseNode(parts[0]), weight: parseWeight(parts[1]) };
        }
        if (parts.length === 1) {
            return { target: parseNode(parts[0]), weight: 1 };
        }
    }
    // bare node token (may itself be a multi-value node, e.g. "[7,9]")
    return { target: parseNode(entry), weight: 1 };
}

function parsePythonAdjacencyDict(input, directed) {
    const edges = [];
    const inner = stripOuter(input, '{', '}');
    if (!inner) return edges;

    const pairs = tokeniseTopLevel(inner);

    for (const pair of pairs) {
        // Split on the FIRST colon that is at depth 0
        let colonIdx = -1;
        let depth = 0;
        for (let i = 0; i < pair.length; i++) {
            const c = pair[i];
            if (c === '(' || c === '[' || c === '{') depth++;
            if (c === ')' || c === ']' || c === '}') depth--;
            if (c === ':' && depth === 0) { colonIdx = i; break; }
        }
        if (colonIdx === -1) { console.error('Invalid adjacency entry:', pair); continue; }

        const source = parseNode(pair.slice(0, colonIdx).trim());
        const valueStr = pair.slice(colonIdx + 1).trim();

        if (valueStr.startsWith('[')) {
            const listInner = stripOuter(valueStr, '[', ']');
            if (!listInner) continue;
            const neighbours = tokeniseTopLevel(listInner);
            for (const nb of neighbours) {
                const { target, weight } = parseNeighbourEntry(nb);
                edges.push({ source, target, weight });
            }
        } else {
            const { target, weight } = parseNeighbourEntry(valueStr);
            edges.push({ source, target, weight });
        }
    }

    return deduplicateEdges(edges, directed);
}

function parsePythonEdgeList(input, directed) {
    const edges = [];
    const inner = stripOuter(input, '[', ']');
    if (!inner) return edges;

    const tuples = tokeniseTopLevel(inner);

    for (const tuple of tuples) {
        const t = tuple.trim();
        if (!t.startsWith('(')) { console.error('Expected tuple, got:', t); continue; }
        const tupleInner = stripOuter(t, '(', ')');
        const parts = tokeniseTopLevel(tupleInner);

        if (parts.length < 2) { console.error('Edge tuple needs ≥2 elements:', t); continue; }

        const source = parseNode(parts[0]);
        const target = parseNode(parts[1]);
        const weight = parts.length >= 3 ? parseWeight(parts[2]) : 1;

        edges.push({ source, target, weight });
    }

    return deduplicateEdges(edges, directed);
}

function parseCompactEdges(edgesInput, directed) {
    const simpleFormat = /^([a-zA-Z0-9]{2})(-?\d*\.?\d*)$/;

    const edgesRaw = tokeniseTopLevel(edgesInput).map(edge => {
        edge = edge.trim();
        let source, target, weight;

        if (simpleFormat.test(edge)) {
            const match = edge.match(simpleFormat);
            source = match[1][0];
            target = match[1][1];
            weight = parseFloat(match[2]);
        } else if (edge.startsWith('(')) {
            // Generic tuple: (source, target[, weight]). source/target may
            // be quoted strings, bare identifiers, or multi-value nodes
            // like [10,20] / 10|20 representing a 2-3/2-3-4/B-tree node.
            const tupleInner = stripOuter(edge, '(', ')');
            const parts = tokeniseTopLevel(tupleInner);
            if (parts.length < 2) { console.error('Edge tuple needs ≥2 elements:', edge); return null; }
            source = parseNode(parts[0]);
            target = parseNode(parts[1]);
            weight = parts.length >= 3 ? parseWeight(parts[2]) : 1;
        } else if (edge.length === 1 || edge.startsWith('[') || edge.includes('|')) {
            // Standalone vertex declaration (no edge yet) — e.g. a lone
            // root node "[10,20]" for a tree that has no children.
            source = parseNode(edge);
            target = null;
            weight = null;
        } else {
            console.error('Invalid edge format:', edge);
            return null;
        }

        if (isNaN(weight)) weight = 1;
        return { source, target, weight };
    }).filter(Boolean);

    return deduplicateEdges(edgesRaw, directed);
}

function nodeKey(node) {
    return Array.isArray(node) ? JSON.stringify(node) : String(node);
}

function deduplicateEdges(edges, directed) {
    const edgeMap = new Map();
    for (const edge of edges) {
        if (edge.source && edge.target) {
            const key = `${nodeKey(edge.source)}_${nodeKey(edge.target)}`;
            edgeMap.set(key, edge);
            if (!directed) {
                const reverseKey = `${nodeKey(edge.target)}_${nodeKey(edge.source)}`;
                if (edgeMap.has(reverseKey)) edgeMap.delete(reverseKey);
            }
        } else if (edge.source && edge.target === null) {
            // standalone vertex declaration — one entry per distinct node
            edgeMap.set(`__node__${nodeKey(edge.source)}`, edge);
        }
    }
    return Array.from(edgeMap.values());
}
/* End of edge parsing functionality */

/* Cycle detection */
function hasCycle(edgesRaw, directed = true) {
    if (!edgesRaw || edgesRaw.length === 0) return false;

    const adjList = new Map();
    const addNode = (v) => { if (!adjList.has(v)) adjList.set(v, []); };

    for (const edge of edgesRaw) {
        if (edge.target === null || edge.target === undefined) continue;
        addNode(edge.source);
        addNode(edge.target);
        adjList.get(edge.source).push(edge.target);
        if (!directed) {
            adjList.get(edge.target).push(edge.source);
        }
    }

    if (directed) {
        const WHITE = 0, GRAY = 1, BLACK = 2;
        const color = new Map();
        adjList.forEach((_, v) => color.set(v, WHITE));

        const dfs = (node) => {
            color.set(node, GRAY);
            for (const neighbor of adjList.get(node)) {
                const c = color.get(neighbor);
                if (c === GRAY) return true;
                if (c === WHITE && dfs(neighbor)) return true;
            }
            color.set(node, BLACK);
            return false;
        };

        for (const v of adjList.keys()) {
            if (color.get(v) === WHITE && dfs(v)) return true;
        }
        return false;

    } else {
        const visited = new Set();

        const dfs = (node, parent) => {
            visited.add(node);
            for (const neighbor of adjList.get(node)) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor, node)) return true;
                } else if (neighbor !== parent) {
                    return true;
                }
            }
            return false;
        };

        for (const v of adjList.keys()) {
            if (!visited.has(v) && dfs(v, null)) return true;
        }
        return false;
    }
}
/* End of cycle detection */

// Inverse of parseEdges function
function stringifyEdges(edgesRaw) {
    return edgesRaw
        .map(edge => `(${edge.source},${edge.target},${edge.weight})`)
        .join(',');
}

function indexToLabel(index) {
    let label = '';
    while (index >= 0) {
        label = String.fromCharCode(97 + (index % 26)) + label;
        index = Math.floor(index / 26) - 1;
    }
    return label;
}

// This function currently supports generating multigraphs as well, but that functionality has been disabled
function generateRandomGraph(vertexCount, edgeCount, options = {}) {
    const {
        allowDuplicates = duplicateEdges.checked,
        ensureConnected = connected.checked,
        allowSelfLoops = selfLoops.checked,
        minWeightValue = parseInt(minWeight.value),
        maxWeightValue = parseInt(maxWeight.value),
        isDirectedValue = isDirected.checked,
        alphabet = false // New parameter: false = numbers, true = letters
    } = options;

    if (vertexCount <= 0) {
        alert("Vertex count must be greater than 0.");
        graphInputField.value = "";
        return;
    }

    let maxEdgesWithoutDuplicates = 0;
    if (allowSelfLoops) {
        if (isDirectedValue) {
            maxEdgesWithoutDuplicates = vertexCount * vertexCount; // Directed with self-loops
        } else {
            maxEdgesWithoutDuplicates = vertexCount * (vertexCount - 1) / 2 + vertexCount; // Undirected with self-loops
        }
    } else {
        if (isDirectedValue) {
            maxEdgesWithoutDuplicates = vertexCount * (vertexCount - 1); // Directed without self-loops
        } else {
            maxEdgesWithoutDuplicates = vertexCount * (vertexCount - 1) / 2; // Undirected without self-loops
        }
    }

    const minEdgesToConnect = vertexCount - 1;

    // Adjust edge count
    if (edgeCount < minEdgesToConnect) {
        if (ensureConnected) {
            alert(`To ensure connectivity, at least ${minEdgesToConnect} edges are needed. Using minimum required.`);
            edgeCount = minEdgesToConnect;
        }
    }

    if (!allowDuplicates && edgeCount > maxEdgesWithoutDuplicates) {
        alert(`Too many edges for a simple graph (no duplicates${allowSelfLoops ? '' : ', no self-loops'}). Using max allowed.`);
        edgeCount = maxEdgesWithoutDuplicates;
    }

    // Helper to generate sequential labels (Numbers: 1, 2, 3... or Letters: A, B, C... Z, AA...)
    const getLabel = (index, useAlphabet) => {
        if (!useAlphabet) return (index + 1).toString();
        
        let label = '';
        let temp = index;
        while (temp >= 0) {
            label = String.fromCharCode((temp % 26) + 65) + label;
            temp = Math.floor(temp / 26) - 1;
        }
        return label;
    };

    // Use getLabel instead of indexToLabel
    const vertices = Array.from({ length: vertexCount }, (_, i) => getLabel(i, alphabet));
    const edges = new Set();
    const edgeList = [];

    const usedVertices = new Set();

    // Build spanning tree if needed
    if (ensureConnected && vertexCount > 1) {
        const shuffled = [...vertices];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        for (let i = 1; i < shuffled.length; i++) {
            const u = shuffled[i - 1];
            const v = shuffled[i];
            const weight = Math.floor(Math.random() * (maxWeightValue - minWeightValue + 1)) + minWeightValue;
            const key = `${u}_${v}`;
            edges.add(key);
            edgeList.push({ source: u, target: v, weight });
            usedVertices.add(u);
            usedVertices.add(v);
        }
    }

    // Add additional edges, but with a loop cap
    let attempts = 0;
    const maxAttempts = edgeCount * 10;

    while (edgeList.length < edgeCount && attempts < maxAttempts) {
        attempts++;

        const u = vertices[Math.floor(Math.random() * vertexCount)];
        const v = vertices[Math.floor(Math.random() * vertexCount)];
        if (!allowSelfLoops && u === v) continue;

        const key = `${u}_${v}`;
        const reverseKey = `${v}_${u}`;

        if (!allowDuplicates) {
            if (isDirectedValue) {
                if (edges.has(key)) continue;
            } else {
                if (edges.has(key) || edges.has(reverseKey)) continue;
            }
            edges.add(key);
        }


        const weight = Math.floor(Math.random() * (maxWeightValue - minWeightValue + 1)) + minWeightValue;

        if (!allowDuplicates) edges.add(key);
        edgeList.push({ source: u, target: v, weight });
        usedVertices.add(u);
        usedVertices.add(v);
    }

    graphInputField.value = stringifyEdges(edgeList);
    addGraph(null,null,null,null,null,false);
}

/* Random tree generation functionality */
function generateRandomTree(vertexCount, options = {}) {
    const {
        minWeightValue = parseInt(minWeight?.value || 1),
        maxWeightValue = parseInt(maxWeight?.value || 10),
        isDirectedValue = isDirected?.checked || false,
        treeTypeValue = typeof treeTypeSelect !== 'undefined' ? treeTypeSelect.value : 'regular',
        bTreeOrderValue = typeof bTreeOrderInput !== 'undefined' ? parseInt(bTreeOrderInput.value) : 4,
        alphabet = false // false = numbers (1, 2, 3), true = letters (A, B, C)
    } = options;

    if (vertexCount <= 0) {
        alert("Vertex count must be greater than 0.");
        if (typeof graphInputField !== 'undefined') graphInputField.value = "";
        return;
    }

    const edgeList = [];
    let standaloneLabel = null;
    const treeType = treeTypeValue;

    // Helper to generate sequential labels (Numbers: 1, 2, 3... or Letters: A, B, C... Z, AA...)
    const getLabel = (index, useAlphabet) => {
        if (!useAlphabet) return (index + 1).toString();

        let label = '';
        let temp = index;
        while (temp >= 0) {
            label = String.fromCharCode((temp % 26) + 65) + label;
            temp = Math.floor(temp / 26) - 1;
        }
        return label;
    };

    // Initialize sequentially ordered vertices
    const vertices = [];
    for (let i = 0; i < vertexCount; i++) {
        vertices.push(getLabel(i, alphabet));
    }

    const getRandomWeight = () => Math.floor(Math.random() * (maxWeightValue - minWeightValue + 1)) + minWeightValue;

    const shuffle = (arr) => {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };

    const isOrderedTree = treeType === 'binarySearch' || treeType === 'avl' || treeType === 'redBlack';

    if (vertexCount > 1 && isOrderedTree) {
        const indices = shuffle(Array.from({ length: vertexCount }, (_, i) => i));

        let root;
        if (treeType === 'binarySearch') {
            root = buildPlainBST(indices);
        } else if (treeType === 'avl') {
            root = buildAVL(indices);
        } else {
            root = buildRedBlack(indices);
        }

        // Emit edges: left child before right child, for every node.
        emitOrderedEdges(root, vertices, edgeList, getRandomWeight);

    } else if (vertexCount >= 1 && treeType === 'b') {
        const order = Math.max(2, parseInt(bTreeOrderValue) || 4);
        const indices = shuffle(Array.from({ length: vertexCount }, (_, i) => i));

        let root = { keys: [], children: [], leaf: true };
        for (const idx of indices) {
            const result = bTreeInsert(root, idx, order);
            if (result) {
                root = {
                    keys: [result.promotedKey],
                    children: [root, result.newRightNode],
                    leaf: false
                };
            }
        }

        emitBTreeEdges(root, vertices, edgeList, getRandomWeight);

        if (edgeList.length === 0) {
            // Whole tree fit in one node (no split happened yet) — still show
            // it as a standalone multi-value vertex declaration.
            standaloneLabel = '[' + root.keys.map(k => vertices[k]).join(',') + ']';
        }

    } else if (vertexCount >= 1 && treeType === 'bPlus') {
        // not from post-hoc index math.
        const order = Math.max(2, parseInt(bTreeOrderValue) || 4);
        const indices = shuffle(Array.from({ length: vertexCount }, (_, i) => i));

        let root = { keys: [], children: [], leaf: true, next: null };
        for (const idx of indices) {
            const result = bPlusTreeInsert(root, idx, order);
            if (result) {
                root = {
                    keys: [result.promotedKey],
                    children: [root, result.newRightNode],
                    leaf: false
                };
            }
        }

        emitBTreeEdges(root, vertices, edgeList, getRandomWeight);

        // Link leaves left-to-right using the real sibling pointers built
        // during leaf splits, not an approximation.
        let leftmost = root;
        while (!leftmost.leaf) leftmost = leftmost.children[0];
        let leaf = leftmost;
        while (leaf.next) {
            const sourceLabel = '[' + leaf.keys.map(k => vertices[k]).join(',') + ']';
            const targetLabel = '[' + leaf.next.keys.map(k => vertices[k]).join(',') + ']';
            edgeList.push({ source: sourceLabel, target: targetLabel, weight: 1, isLeafLink: true });
            leaf = leaf.next;
        }

        if (edgeList.length === 0) {
            standaloneLabel = '[' + root.keys.map(k => vertices[k]).join(',') + ']';
        }

    } else if (vertexCount > 1) {
        let branchingFactor;
        switch (treeType) {
            case 'binary':
                branchingFactor = 2;
                break;
            case 'twoThree':
                branchingFactor = 3;
                break;
            case 'twoThreeFour':
                branchingFactor = 4;
                break;
            case 'regular':
            default:
                branchingFactor = Math.floor(Math.random() * 3) + 2;
                break;
        }

        // Generate edges using strict BFS-order sequential math.
        for (let i = 1; i < vertices.length; i++) {
            let parentIndex = Math.floor((i - 1) / branchingFactor);
            let u = vertices[parentIndex];
            let v = vertices[i];
            edgeList.push({ source: u, target: v, weight: getRandomWeight() });
        }
    }

    // Output to the DOM elements.
    // B-tree / B+-tree results are written as an adjacency dict (grouping
    // each node's children together, e.g. "{[20,40]: [[10], [30,35]]}")
    // since that's the natural shape for multi-key tree nodes; every other
    // tree type keeps using the original tuple-list format unchanged.
    if (treeType === 'b' || treeType === 'bPlus') {
        graphInputField.value = standaloneLabel !== null
            ? standaloneLabel
            : stringifyEdgesAsAdjacencyDict(edgeList);
    } else {
        graphInputField.value = stringifyEdges(edgeList);
    }
    addGraph(null,null,null,null,null,true);
    return { vertices, edgeList };
}

function buildPlainBST(indices) {
    let root = null;

    const insert = (node, idx) => {
        if (!node) return { idx, left: null, right: null };
        if (idx < node.idx) node.left = insert(node.left, idx);
        else node.right = insert(node.right, idx);
        return node;
    };

    for (const idx of indices) {
        root = insert(root, idx);
    }
    return root;
}

function buildAVL(indices) {
    let root = null;

    const height = (n) => (n ? n.height : 0);
    const updateHeight = (n) => { n.height = 1 + Math.max(height(n.left), height(n.right)); };
    const balanceFactor = (n) => (n ? height(n.left) - height(n.right) : 0);

    const rotateRight = (y) => {
        const x = y.left;
        y.left = x.right;
        x.right = y;
        updateHeight(y);
        updateHeight(x);
        return x;
    };

    const rotateLeft = (x) => {
        const y = x.right;
        x.right = y.left;
        y.left = x;
        updateHeight(x);
        updateHeight(y);
        return y;
    };

    const insert = (node, idx) => {
        if (!node) return { idx, left: null, right: null, height: 1 };
        if (idx < node.idx) node.left = insert(node.left, idx);
        else node.right = insert(node.right, idx);

        updateHeight(node);
        const bf = balanceFactor(node);

        // Left Left
        if (bf > 1 && idx < node.left.idx) return rotateRight(node);
        // Right Right
        if (bf < -1 && idx > node.right.idx) return rotateLeft(node);
        // Left Right
        if (bf > 1 && idx > node.left.idx) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        // Right Left
        if (bf < -1 && idx < node.right.idx) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    };

    for (const idx of indices) {
        root = insert(root, idx);
    }
    return root;
}

// --- Real B-tree construction (order = max children per node) ---
function bTreeInsert(node, key, order) {
    const maxKeys = order - 1;

    if (node.leaf) {
        insertSortedKey(node.keys, key);
    } else {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) i++;
        const result = bTreeInsert(node.children[i], key, order);
        if (result) {
            node.keys.splice(i, 0, result.promotedKey);
            node.children.splice(i + 1, 0, result.newRightNode);
        }
    }

    if (node.keys.length > maxKeys) {
        return splitBTreeNode(node);
    }
    return null;
}

function splitBTreeNode(node) {
    // node.keys.length === order (one over capacity) when this is called.
    const mid = Math.floor(node.keys.length / 2);
    const promotedKey = node.keys[mid];

    const leftKeys = node.keys.slice(0, mid);
    const rightKeys = node.keys.slice(mid + 1);

    let leftChildren = [];
    let rightChildren = [];
    if (!node.leaf) {
        leftChildren = node.children.slice(0, mid + 1);
        rightChildren = node.children.slice(mid + 1);
    }

    // Reuse `node` as the left half in place, and build a fresh right half.
    node.keys = leftKeys;
    node.children = leftChildren;

    const newRightNode = { keys: rightKeys, children: rightChildren, leaf: node.leaf };
    return { promotedKey, newRightNode };
}

function insertSortedKey(keys, key) {
    let i = keys.length - 1;
    while (i >= 0 && keys[i] > key) i--;
    keys.splice(i + 1, 0, key);
}

function emitBTreeEdges(node, vertices, edgeList, getRandomWeight) {
    if (!node) return null;

    const label = '[' + node.keys.map(k => vertices[k]).join(',') + ']';

    if (!node.leaf) {
        for (const child of node.children) {
            const childLabel = emitBTreeEdges(child, vertices, edgeList, getRandomWeight);
            edgeList.push({ source: label, target: childLabel, weight: getRandomWeight() });
        }
    }

    return label;
}

// --- Real B+-tree construction ---

function bPlusTreeInsert(node, key, order) {
    const maxKeys = order - 1;

    if (node.leaf) {
        insertSortedKey(node.keys, key);
        if (node.keys.length > maxKeys) {
            return splitBPlusLeaf(node);
        }
        return null;
    }

    let i = 0;
    while (i < node.keys.length && key >= node.keys[i]) i++;
    const result = bPlusTreeInsert(node.children[i], key, order);
    if (result) {
        node.keys.splice(i, 0, result.promotedKey);
        node.children.splice(i + 1, 0, result.newRightNode);
    }

    if (node.keys.length > maxKeys) {
        return splitBTreeNode(node); // internal nodes split like a plain B-tree
    }
    return null;
}

function splitBPlusLeaf(leaf) {
    // leaf.keys.length === order (one over capacity) when this is called.
    const mid = Math.floor(leaf.keys.length / 2);
    const rightKeys = leaf.keys.slice(mid);
    leaf.keys = leaf.keys.slice(0, mid);

    const newRightLeaf = { keys: rightKeys, children: [], leaf: true, next: leaf.next };
    leaf.next = newRightLeaf;

    // Promote a *copy* of the right leaf's first key — it still lives in
    // the leaf too, unlike an internal-node split which removes it.
    return { promotedKey: rightKeys[0], newRightNode: newRightLeaf };
}

function stringifyEdgesAsAdjacencyDict(edgeList) {
    if (edgeList.length === 0) return '';

    const groups = new Map();
    for (const edge of edgeList) {
        if (!groups.has(edge.source)) groups.set(edge.source, []);
        groups.get(edge.source).push(edge.target);
    }

    const entries = Array.from(groups.entries())
        .map(([source, targets]) => `${source}: [${targets.join(', ')}]`);
    return `{${entries.join(', ')}}`;
}

function emitOrderedEdges(root, vertices, edgeList, getRandomWeight) {
    if (!root) return;

    const walk = (node) => {
        if (!node) return;
        if (node.left) {
            edgeList.push({
                source: vertices[node.idx],
                target: vertices[node.left.idx],
                weight: getRandomWeight()
            });
        }
        if (node.right) {
            edgeList.push({
                source: vertices[node.idx],
                target: vertices[node.right.idx],
                weight: getRandomWeight()
            });
        }
        walk(node.left);
        walk(node.right);
    };

    walk(root);
}
/* End of random tree generation functionality */

function buildPlainBST(indices) {
    let root = null;

    const insert = (node, idx) => {
        if (!node) return { idx, left: null, right: null };
        if (idx < node.idx) node.left = insert(node.left, idx);
        else node.right = insert(node.right, idx);
        return node;
    };

    for (const idx of indices) {
        root = insert(root, idx);
    }
    return root;
}

function buildAVL(indices) {
    let root = null;

    const height = (n) => (n ? n.height : 0);
    const updateHeight = (n) => { n.height = 1 + Math.max(height(n.left), height(n.right)); };
    const balanceFactor = (n) => (n ? height(n.left) - height(n.right) : 0);

    const rotateRight = (y) => {
        const x = y.left;
        y.left = x.right;
        x.right = y;
        updateHeight(y);
        updateHeight(x);
        return x;
    };

    const rotateLeft = (x) => {
        const y = x.right;
        x.right = y.left;
        y.left = x;
        updateHeight(x);
        updateHeight(y);
        return y;
    };

    const insert = (node, idx) => {
        if (!node) return { idx, left: null, right: null, height: 1 };
        if (idx < node.idx) node.left = insert(node.left, idx);
        else node.right = insert(node.right, idx);

        updateHeight(node);
        const bf = balanceFactor(node);

        // Left Left
        if (bf > 1 && idx < node.left.idx) return rotateRight(node);
        // Right Right
        if (bf < -1 && idx > node.right.idx) return rotateLeft(node);
        // Left Right
        if (bf > 1 && idx > node.left.idx) {
            node.left = rotateLeft(node.left);
            return rotateRight(node);
        }
        // Right Left
        if (bf < -1 && idx < node.right.idx) {
            node.right = rotateRight(node.right);
            return rotateLeft(node);
        }
        return node;
    };

    for (const idx of indices) {
        root = insert(root, idx);
    }
    return root;
}

function bTreeInsert(node, key, order) {
    const maxKeys = order - 1;

    if (node.leaf) {
        insertSortedKey(node.keys, key);
    } else {
        let i = 0;
        while (i < node.keys.length && key > node.keys[i]) i++;
        const result = bTreeInsert(node.children[i], key, order);
        if (result) {
            node.keys.splice(i, 0, result.promotedKey);
            node.children.splice(i + 1, 0, result.newRightNode);
        }
    }

    if (node.keys.length > maxKeys) {
        return splitBTreeNode(node);
    }
    return null;
}

function splitBTreeNode(node) {
    // node.keys.length === order (one over capacity) when this is called.
    const mid = Math.floor(node.keys.length / 2);
    const promotedKey = node.keys[mid];

    const leftKeys = node.keys.slice(0, mid);
    const rightKeys = node.keys.slice(mid + 1);

    let leftChildren = [];
    let rightChildren = [];
    if (!node.leaf) {
        leftChildren = node.children.slice(0, mid + 1);
        rightChildren = node.children.slice(mid + 1);
    }

    // Reuse `node` as the left half in place, and build a fresh right half.
    node.keys = leftKeys;
    node.children = leftChildren;

    const newRightNode = { keys: rightKeys, children: rightChildren, leaf: node.leaf };
    return { promotedKey, newRightNode };
}

function insertSortedKey(keys, key) {
    let i = keys.length - 1;
    while (i >= 0 && keys[i] > key) i--;
    keys.splice(i + 1, 0, key);
}

function emitBTreeEdges(node, vertices, edgeList, getRandomWeight) {
    if (!node) return null;

    const label = '[' + node.keys.map(k => vertices[k]).join(',') + ']';

    if (!node.leaf) {
        for (const child of node.children) {
            const childLabel = emitBTreeEdges(child, vertices, edgeList, getRandomWeight);
            edgeList.push({ source: label, target: childLabel, weight: getRandomWeight() });
        }
    }

    return label;
}

function emitOrderedEdges(root, vertices, edgeList, getRandomWeight) {
    if (!root) return;

    const walk = (node) => {
        if (!node) return;
        if (node.left) {
            edgeList.push({
                source: vertices[node.idx],
                target: vertices[node.left.idx],
                weight: getRandomWeight()
            });
        }
        if (node.right) {
            edgeList.push({
                source: vertices[node.idx],
                target: vertices[node.right.idx],
                weight: getRandomWeight()
            });
        }
        walk(node.left);
        walk(node.right);
    };

    walk(root);
}
/* End of random tree generation functionality */

generateRandomButton.addEventListener('click', () => {
    const vertexCount = vertexInput.value;
    if (isTypeGraph.checked) {
        const edgeCount = edgeInput.value;
        generateRandomGraph(vertexCount, edgeCount);
    } else {
        generateRandomTree(vertexCount);
    }
});

generateSimpleButton.addEventListener('click', () => {
    vertexInput.value = `${Math.floor(Math.random() * 3) + 4}`;
    if (directed.checked) {
        edgeInput.value = `${Math.floor(Math.random() * 7) + 6}`;
    } else {
        edgeInput.value = "6";
    }
    minWeight.value = "1";
    maxWeight.value = "10";
    generateRandomButton.click();
});

generateComplexButton.addEventListener('click', () => {
    vertexInput.value = `${Math.floor(Math.random() * 4) + 7}`
    edgeInput.value = `${Math.floor(Math.random() * 13) + 12}`;
    minWeight.value = "5";
    maxWeight.value = "15";
    generateRandomButton.click();
});

function enableGraphNameEditing(nameInput) {
    nameInput.removeAttribute('readonly');
    nameInput.classList.add('editable');
    nameInput.focus();

    availableGraphs.delete(nameInput.value);
}

function handleGraphNameInput(event, nameInput) {
    if (event.key !== 'Enter') return;

    nameInput.setAttribute('readonly', true);
    nameInput.classList.remove('editable');

    const requestedName = nameInput.value;

    if (availableGraphs.has(requestedName)) {
        const existingInput = document.getElementById(requestedName);

        // Only rename another graph, not the one currently being edited
        if (existingInput && existingInput !== nameInput) {
            availableGraphs.delete(requestedName);

            let counter = 1;
            let renamed = `${requestedName}.${String(counter).padStart(3, '0')}`;

            while (availableGraphs.has(renamed)) {
                counter++;
                renamed = `${requestedName}.${String(counter).padStart(3, '0')}`;
            }

            existingInput.value = renamed;
            existingInput.id = renamed;
            existingInput.title = renamed;

            availableGraphs.add(renamed);
        }
    }

    nameInput.value = requestedName;
    nameInput.id = requestedName;
    nameInput.title = requestedName;
    availableGraphs.add(requestedName);
}

function deleteGraph(container, displayName, dupDelMenuObj, showHideDeleteDiv) {
    dupDelMenuObj.style.display = 'none';
    // Remove the container from the DOM
    container.remove();
    showHideDeleteDiv.remove();

    // Remove from global list of graph names
    availableGraphs.delete(displayName);
    graphMap.delete(displayName);

    // Remove from the methods list UI
    const methodsEntry = document.getElementById(displayName);
    if (methodsEntry) methodsEntry.remove();
}

/* Tree functionality - This is determined by the location of the nodes */
/* Verify for tree */
function isTree(edgesInput, directed = true) {
    const edges = typeof parseEdges === 'function' ? parseEdges(edgesInput, directed) : edgesInput;
    if (!edges) return false;

    const vertices = new Set();
    edges.forEach(edge => {
        if (edge.source !== undefined) vertices.add(edge.source);
        if (edge.target !== undefined) vertices.add(edge.target);
    });

    if (vertices.size <= 1) return edges.length === 0;

    const adjList = new Map();
    vertices.forEach(v => adjList.set(v, []));

    if (directed) {
        const inDegrees = new Map();
        vertices.forEach(v => inDegrees.set(v, 0));

        edges.forEach(edge => {
            adjList.get(edge.source).push(edge.target);
            inDegrees.set(edge.target, inDegrees.get(edge.target) + 1);
        });

        let root = null;
        let rootCount = 0;

        for (const [v, deg] of inDegrees.entries()) {
            if (deg === 0) {
                root = v;
                rootCount++;
            } else if (deg > 2) {
                // Standard/B/2-3/2-3-4 trees max in-degree is 1. 
                // B+ trees max in-degree is 2 (1 parent link, 1 left sibling link).
                return false; 
            }
        }

        // A valid tree (or B+ tree) must have exactly one root
        if (rootCount !== 1) return false;

        // 1. Check if all nodes are reachable from the root (Fully Connected)
        const visited = new Set([root]);
        const queue = [root];

        while (queue.length > 0) {
            const current = queue.shift();
            for (const neighbor of adjList.get(current)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        if (visited.size !== vertices.size) return false;

        // 2. Check for cycles (DAG check). B+ tree sibling links do not create 
        // directed cycles, but they would falsely trigger standard undirected checks.
        const cycleVisited = new Set();
        const recursionStack = new Set();
        let hasCycle = false;

        const dfsCycle = (node) => {
            if (hasCycle) return;
            cycleVisited.add(node);
            recursionStack.add(node);

            for (const neighbor of adjList.get(node)) {
                if (!cycleVisited.has(neighbor)) {
                    dfsCycle(neighbor);
                } else if (recursionStack.has(neighbor)) {
                    hasCycle = true;
                }
            }
            recursionStack.delete(node);
        };

        dfsCycle(root);
        return !hasCycle;

    } else {
        // Undirected graph evaluation
        edges.forEach(edge => {
            adjList.get(edge.source).push(edge.target);
            adjList.get(edge.target).push(edge.source);
        });

        const startNode = vertices.values().next().value;
        const visited = new Set([startNode]);
        const queue = [startNode];

        while (queue.length > 0) {
            const current = queue.shift();
            for (const neighbor of adjList.get(current)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        // Graph must be fully connected
        if (visited.size !== vertices.size) return false;

        // Standard trees (including B, 2-3, 2-3-4) strictly adhere to E = V - 1
        if (edges.length === vertices.size - 1) {
            return true;
        }
        const isBTreeFormat = Array.from(vertices).some(v => typeof v === 'string' && v.trim().startsWith('[') && v.trim().endsWith(']'));
        
        return isBTreeFormat;
    }
}

// Parses "translate(x,y)" out of a transform attribute — used as a
// fallback when the bound datum isn't available for some reason.
function parseTranslate(transformStr) {
    if (!transformStr) return null;
    const match = transformStr.match(/translate\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/);
    return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : null;
}

function convertToTreeJSON(edgesInput, svg, directed = true) {
    const nodeMap = new Map();

    // Nodes are now <rect class="node"> positioned via a
    // transform="translate(x,y)" (rects have no cx/cy), instead of
    // <circle> with cx/cy attributes.
    svg.selectAll("rect.node").each(function (d) {
        const element = d3.select(this);

        const id = element.attr("id") || (d && d.id);
        const fromTransform = parseTranslate(element.attr("transform"));

        // Prefer the bound datum's x/y (authoritative — kept in sync by
        // the simulation/drag/layout code); fall back to parsing the
        // transform attribute directly if the datum is unavailable.
        const cx = (d && d.x) ?? fromTransform?.x ?? 0;
        const cy = (d && d.y) ?? fromTransform?.y ?? 0;

        if (id !== undefined && id !== null) {
            nodeMap.set(String(id), {
                id: id,
                x: cx,
                y: cy,
                children: []
            });
        }
    });

    const edges = parseEdges(edgesInput, directed);
    if (!edges || edges.length === 0) return null;

    const inDegrees = new Map();
    for (const key of nodeMap.keys()) {
        inDegrees.set(key, 0);
    }

    edges.forEach(edge => {
        const sourceId = String(edge.source);
        const targetId = String(edge.target);

        const parentNode = nodeMap.get(sourceId);
        const childNode = nodeMap.get(targetId);

        if (parentNode && childNode) {
            parentNode.children.push(childNode);
            inDegrees.set(targetId, (inDegrees.get(targetId) || 0) + 1);
        }
    });

    let root = null;
    for (const [id, degree] of inDegrees.entries()) {
        if (degree === 0) {
            root = nodeMap.get(id);
            break; // Found the root
        }
    }
    return root;
}

function isBSTJSON(root) {
    if (!root) return { valid: true, reason: "Empty tree is trivially a valid BST." };

    // Helper to get the display name/value, handling the new label property
    // Helper to get the display name/value, handling missing labels
    const getValStr = (n) => {
        if (n.label !== undefined) return n.label;
        
        // If label is missing, strip the suffix (e.g., "10_1" becomes "10")
        const idStr = String(n.id);
        const lastUnderscore = idStr.lastIndexOf('_');
        
        if (lastUnderscore !== -1) {
            return idStr.substring(0, lastUnderscore);
        }
        
        return idStr;
    };

    // Decide which child is "left" and which is "right" for a given node.
    function resolveChildren(node) {
        const kids = node.children || [];

        if (kids.length === 0) {
            return { left: null, right: null };
        }

        if (kids.length === 1) {
            // Ambiguous by position — decide by value instead.
            const child = kids[0];
            const parentValue = Number(getValStr(node));
            const childValue = Number(getValStr(child));

            if (childValue < parentValue) {
                return { left: child, right: null };
            } else if (childValue > parentValue) {
                return { left: null, right: child };
            } else {
                // Equal values aren't valid in a strict BST regardless of side.
                return { left: null, right: null, duplicate: child };
            }
        }

        if (kids.length === 2) {
            const [a, b] = kids;
            if (a.x === b.x) {
                // Can't disambiguate by position if x values tie.
                return { ambiguous: true };
            }
            return a.x < b.x ? { left: a, right: b } : { left: b, right: a };
        }

        // More than 2 children can't be a binary tree at all.
        return { tooManyChildren: true };
    }

    function validate(node, min, max, path) {
        if (!node) return { valid: true };

        const valStr = getValStr(node);
        const value = Number(valStr);
        
        if (Number.isNaN(value)) {
            return { valid: false, reason: `Node "${valStr}" at ${path} has a non-numeric value. (Internal ID: ${node.id})` };
        }

        if (value <= min || value >= max) {
            return {
                valid: false,
                reason: `Node "${valStr}" at ${path} violates BST bounds (must be in (${min}, ${max})).`
            };
        }

        const resolved = resolveChildren(node);

        if (resolved.tooManyChildren) {
            return { valid: false, reason: `Node "${valStr}" at ${path} has more than 2 children.` };
        }
        if (resolved.ambiguous) {
            return { valid: false, reason: `Node "${valStr}" at ${path} has two children with identical x coordinates; left/right can't be determined.` };
        }
        if (resolved.duplicate) {
            const dupValStr = getValStr(resolved.duplicate);
            return { valid: false, reason: `Node "${valStr}" at ${path} has a child "${dupValStr}" with an equal value.` };
        }

        const leftResult = validate(resolved.left, min, value, `${path} -> left`);
        if (!leftResult.valid) return leftResult;

        const rightResult = validate(resolved.right, value, max, `${path} -> right`);
        if (!rightResult.valid) return rightResult;

        return { valid: true };
    }

    return validate(root, -Infinity, Infinity, `root(${getValStr(root)})`);
}

function isAVLJSON(root) {
    if (!root) return { valid: true, reason: "Empty tree is trivially a valid AVL tree." };

    // Helper to get the display name/value, handling the new label property
    // Helper to get the display name/value, handling missing labels
    const getValStr = (n) => {
        if (n.label !== undefined) return n.label;
        
        // If label is missing, strip the suffix (e.g., "10_1" becomes "10")
        const idStr = String(n.id);
        const lastUnderscore = idStr.lastIndexOf('_');
        
        if (lastUnderscore !== -1) {
            return idStr.substring(0, lastUnderscore);
        }
        
        return idStr;
    };

    // Decide which child is "left" and which is "right" for a given node.
    function resolveChildren(node) {
        const kids = node.children || [];

        if (kids.length === 0) {
            return { left: null, right: null };
        }

        if (kids.length === 1) {
            // Ambiguous by position — decide by value instead.
            const child = kids[0];
            const parentValue = Number(getValStr(node));
            const childValue = Number(getValStr(child));

            if (childValue < parentValue) {
                return { left: child, right: null };
            } else if (childValue > parentValue) {
                return { left: null, right: child };
            } else {
                // Equal values aren't valid in a strict BST regardless of side.
                return { left: null, right: null, duplicate: child };
            }
        }

        if (kids.length === 2) {
            const [a, b] = kids;
            if (a.x === b.x) {
                // Can't disambiguate by position if x values tie.
                return { ambiguous: true };
            }
            return a.x < b.x ? { left: a, right: b } : { left: b, right: a };
        }

        // More than 2 children can't be a binary tree at all.
        return { tooManyChildren: true };
    }

    // Recursively validates BST properties and calculates height for AVL balance.
    function validateAndGetHeight(node, min, max, path) {
        if (!node) return { valid: true, height: 0 };

        const valStr = getValStr(node);
        const value = Number(valStr);
        
        if (Number.isNaN(value)) {
            return { valid: false, reason: `Node "${valStr}" at ${path} has a non-numeric value. (Internal ID: ${node.id})` };
        }

        if (value <= min || value >= max) {
            return {
                valid: false,
                reason: `Node "${valStr}" at ${path} violates BST bounds (must be in (${min}, ${max})).`
            };
        }

        const resolved = resolveChildren(node);

        if (resolved.tooManyChildren) {
            return { valid: false, reason: `Node "${valStr}" at ${path} has more than 2 children.` };
        }
        if (resolved.ambiguous) {
            return { valid: false, reason: `Node "${valStr}" at ${path} has two children with identical x coordinates; left/right can't be determined.` };
        }
        if (resolved.duplicate) {
            const dupValStr = getValStr(resolved.duplicate);
            return { valid: false, reason: `Node "${valStr}" at ${path} has a child "${dupValStr}" with an equal value.` };
        }

        // 1. Validate left subtree and get its height
        const leftResult = validateAndGetHeight(resolved.left, min, value, `${path} -> left`);
        if (!leftResult.valid) return leftResult;

        // 2. Validate right subtree and get its height
        const rightResult = validateAndGetHeight(resolved.right, value, max, `${path} -> right`);
        if (!rightResult.valid) return rightResult;

        // 3. Check AVL Balance Property
        const heightDifference = Math.abs(leftResult.height - rightResult.height);
        if (heightDifference > 1) {
            return {
                valid: false, 
                reason: `Node "${valStr}" at ${path} violates AVL balance property. Left subtree height is ${leftResult.height}, right subtree height is ${rightResult.height}.`
            };
        }

        // 4. Return valid status and the current node's height
        return { 
            valid: true, 
            height: 1 + Math.max(leftResult.height, rightResult.height) 
        };
    }

    // Execute validation and format the final output to hide internal height tracking
    const finalResult = validateAndGetHeight(root, -Infinity, Infinity, `root(${getValStr(root)})`);
    
    if (!finalResult.valid) {
        return { valid: false, reason: finalResult.reason };
    }

    return { valid: true, reason: "Tree is a valid AVL tree." };
}

// function isRedBlackJSON(root) {
//     if (!root) return { valid: true, reason: "Empty tree is trivially a valid Red-Black tree." };

//     const rootColor = (root.color || "").toLowerCase();
//     if (rootColor !== "black") {
//         return { valid: false, reason: `Root node "${root.id}" violates Red-Black property: Root must be black.` };
//     }

//     function resolveChildren(node) {
//         const kids = node.children || [];

//         if (kids.length === 0) {
//             return { left: null, right: null };
//         }

//         if (kids.length === 1) {
//             const child = kids[0];
//             const parentValue = Number(node.id);
//             const childValue = Number(child.id);

//             if (childValue < parentValue) {
//                 return { left: child, right: null };
//             } else if (childValue > parentValue) {
//                 return { left: null, right: child };
//             } else {
//                 return { left: null, right: null, duplicate: child };
//             }
//         }

//         if (kids.length === 2) {
//             const [a, b] = kids;
//             if (a.x === b.x) {
//                 return { ambiguous: true };
//             }
//             return a.x < b.x ? { left: a, right: b } : { left: b, right: a };
//         }

//         return { tooManyChildren: true };
//     }

//     // Recursively validates BST bounds, Red-Black color rules, and calculates black height
//     function validateAndCheckBlackHeight(node, min, max, path) {
//         if (!node) {
//             return { valid: true, blackHeight: 1, isBlack: true };
//         }

//         const value = Number(node.id);
//         if (Number.isNaN(value)) {
//             return { valid: false, reason: `Node "${node.id}" at ${path} has a non-numeric id.` };
//         }

//         if (value <= min || value >= max) {
//             return {
//                 valid: false,
//                 reason: `Node "${node.id}" at ${path} violates BST bounds (must be in (${min}, ${max})).`
//             };
//         }

//         // Rule 1: Every node is either red or black.
//         const color = (node.color || "").toLowerCase();
//         if (color !== "red" && color !== "black") {
//             return { 
//                 valid: false, 
//                 reason: `Node "${node.id}" at ${path} has an invalid or missing color: "${color}". Must be "red" or "black".` 
//             };
//         }
//         const isCurrentBlack = (color === "black");

//         const resolved = resolveChildren(node);

//         if (resolved.tooManyChildren) {
//             return { valid: false, reason: `Node "${node.id}" at ${path} has more than 2 children.` };
//         }
//         if (resolved.ambiguous) {
//             return { valid: false, reason: `Node "${node.id}" at ${path} has two children with identical x coordinates.` };
//         }
//         if (resolved.duplicate) {
//             return { valid: false, reason: `Node "${node.id}" at ${path} has a child "${resolved.duplicate.id}" with an equal value.` };
//         }

//         // Validate subtrees
//         const leftResult = validateAndCheckBlackHeight(resolved.left, min, value, `${path} -> left`);
//         if (!leftResult.valid) return leftResult;

//         const rightResult = validateAndCheckBlackHeight(resolved.right, value, max, `${path} -> right`);
//         if (!rightResult.valid) return rightResult;

//         // Rule 4: If a node is red, both children must be black.
//         if (!isCurrentBlack) {
//             if (!leftResult.isBlack || !rightResult.isBlack) {
//                 return {
//                     valid: false,
//                     reason: `Node "${node.id}" at ${path} is red, but has a red child. Violates no-consecutive-reds rule.`
//                 };
//             }
//         }

//         if (leftResult.blackHeight !== rightResult.blackHeight) {
//             return {
//                 valid: false,
//                 reason: `Node "${node.id}" at ${path} violates black-height rule. Left path black height is ${leftResult.blackHeight}, right path is ${rightResult.blackHeight}.`
//             };
//         }

//         // Calculate and return current subtree's black height.
//         const currentBlackHeight = leftResult.blackHeight + (isCurrentBlack ? 1 : 0);

//         return { 
//             valid: true, 
//             blackHeight: currentBlackHeight,
//             isBlack: isCurrentBlack
//         };
//     }

//     const finalResult = validateAndCheckBlackHeight(root, -Infinity, Infinity, `root(${root.id})`);
    
//     if (!finalResult.valid) {
//         return { valid: false, reason: finalResult.reason };
//     }

//     return { valid: true, reason: "Tree is a valid Red-Black tree." };
// }