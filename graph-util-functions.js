/* Applicable methods */
function filterAlgorithms(algorithms, directed, weighted) {
    // Filter the algorithms based on the graph properties
    const applicableAlgorithms = algorithms.filter(algorithm => {
        if (!directed) {
            // If the graph is undirected, exclude algorithms that only work on directed graphs
            if (algorithm.name === 'topologicalSort' || algorithm.name === 'scc') {
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

function handleAlgorithmClick(algorithm, edgesRaw, nodes, directed, weighted, displayName, methodsElement, svgElement) {
    const resultContainer = document.createElement('p');
    let result = null;
    let label = '';

    const getSource = (promptText) => {
        const input = prompt(promptText);
        return input ? input.toUpperCase() : null;
    };

    switch (algorithm.name) {
        case 'bfs': {
            const source = getSource("Enter source vertex");
            if (!source) break;
            result = bfs(edgesRaw, source, directed);
            label = `BFS with ${source} as source node: `;
            break;
        }
        case 'dfs': {
            const source = getSource("Enter source vertex");
            result = dfs(edgesRaw, source || undefined, directed);
            label = `DFS with ${source} as source node}`;
            break;
        }
        case 'dijkstra': {
            const source = getSource("Enter source vertex");
            if (!source) break;
            result = dijkstra(edgesRaw, source, nodes, directed);
            label = `Dijkstra's through ${displayName} with ${source} as source node: <br> <br>`;
            break;
        }
        case 'floydWarshall':
            result = floydWarshall(edgesRaw, nodes, directed);
            label = `Floyd Warshall through ${displayName}: `;
            break;

        case 'bellmanFord': {
            const source = getSource("Enter source vertex");
            if (!source) break;
            result = bellmanFord(edgesRaw, source, nodes, directed);
            label = `Bellman Ford through ${displayName} with ${source} as source node: <br> <br>`;
            break;
        }
        case 'mst':
            result = mst(edgesRaw, weighted, displayName);
            label = `Generated MST through ${displayName}. `;
            break;

        case 'topologicalSort':
            result = topologicalSort(edgesRaw);
            label = `Topological Sort through ${displayName}: `;
            break;

        case 'scc':
            result = StronglyConnectedComponents(edgesRaw);
            label = `SCC through ${displayName}: `;
            break;

        case 'bcc':
            result = BiconnectedComponents(edgesRaw);
            label = `BCC through ${displayName}: `;
            break;

        default:
            alert("Algorithm not implemented.");
            return;
    }

    if (result !== null) {
        console.log(result)
        resultContainer.innerHTML = `<span style="color: #ffc66d;">${label}</span> ${result} <br>`;
        methodsElement.appendChild(resultContainer);
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
    if (trimmed.startsWith('{')) {
        return parsePythonAdjacencyDict(trimmed, directed);
    }

    if (trimmed.startsWith('[')) {
        return parsePythonEdgeList(trimmed, directed);
    }

    return parseCompactEdges(trimmed, directed);
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

function parseNode(token) {
    token = token.trim();
    if ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))) {
        return token.slice(1, -1);
    }
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
    // bare node token
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

        // Value is a list [...] or a single neighbour
        if (valueStr.startsWith('[')) {
            const listInner = stripOuter(valueStr, '[', ']');
            if (!listInner) continue; // empty list → isolated node (no edges)
            const neighbours = tokeniseTopLevel(listInner);
            for (const nb of neighbours) {
                const { target, weight } = parseNeighbourEntry(nb);
                edges.push({ source, target, weight });
            }
        } else {
            // single bare neighbour (unusual but handle gracefully)
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
    function splitTopLevel(input) {
        const result = [];
        let depth = 0;
        let current = '';
        for (const char of input) {
            if (char === '(') depth++;
            if (char === ')') depth--;
            if (char === ',' && depth === 0) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result.filter(s => s.trim() !== '');
    }

    const simpleFormat = /^([a-zA-Z0-9]{2})(-?\d*\.?\d*)$/;
    const parenFormat  = /^\(\s*([a-zA-Z0-9]+)\s*,\s*([a-zA-Z0-9]+)\s*(?:,\s*(-?\d*\.?\d*)\s*)?\)$/;

    const edgesRaw = splitTopLevel(edgesInput).map(edge => {
        edge = edge.trim();
        let source, target, weight;

        if (simpleFormat.test(edge)) {
            const match = edge.match(simpleFormat);
            source = match[1][0];
            target = match[1][1];
            weight = parseFloat(match[2]);
        } else if (parenFormat.test(edge)) {
            const match = edge.match(parenFormat);
            source = match[1];
            target = match[2];
            weight = parseFloat(match[3]);
        } else if (edge.length === 1) {
            source = edge;
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

function deduplicateEdges(edges, directed) {
    const edgeMap = new Map();
    for (const edge of edges) {
        if (edge.source && edge.target) {
            const key = `${edge.source}_${edge.target}`;
            edgeMap.set(key, edge);
            if (!directed) {
                const reverseKey = `${edge.target}_${edge.source}`;
                if (edgeMap.has(reverseKey)) edgeMap.delete(reverseKey);
            }
        }
    }
    return Array.from(edgeMap.values());
}
/* End of edge parsing functionality */

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
        isDirectedValue = isDirected.checked
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

    const vertices = Array.from({ length: vertexCount }, (_, i) => indexToLabel(i));
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
    graphInputVertices.value = vertices.join(', ');
    addGraph();
}

function generateRandomTree(vertexCount, options = {}) {
    const {
        minWeightValue = parseInt(minWeight.value),
        maxWeightValue = parseInt(maxWeight.value),
        isDirectedValue = isDirected.checked,
        // Pick the selected option directly from the select element
        treeTypeValue = treeTypeSelect ? treeTypeSelect.value : 'regular'
    } = options;

    if (vertexCount <= 0) {
        alert("Vertex count must be greater than 0.");
        graphInputField.value = "";
        return;
    }

    const edgeList = [];
    const treeType = treeTypeValue;

    // Initialize vertices. Index 0 is explicitly "root".
    const vertices = vertexCount > 0 ? ['rt'] : [];
    for (let i = 1; i < vertexCount; i++) {
        vertices.push(indexToLabel(i));
    }

    if (vertexCount > 1) {
        const remaining = [...vertices.slice(1)];

        // Shuffle the remaining vertices to randomize attachment order
        for (let i = remaining.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }

        const getRandomWeight = () => Math.floor(Math.random() * (maxWeightValue - minWeightValue + 1)) + minWeightValue;

        if (treeType === 'regular') {
            const treeNodes = ['rt'];
            for (const v of remaining) {
                let u = treeNodes[Math.floor(Math.random() * treeNodes.length)];
                edgeList.push({ source: u, target: v, weight: getRandomWeight() });
                treeNodes.push(v);
            }
        }
        else if (treeType === 'binary') {
            const treeNodes = ['rt'];
            const childrenCount = { 'rt': 0 };

            for (const v of remaining) {
                // Only allow attachment to nodes that have less than 2 children
                const availableNodes = treeNodes.filter(node => childrenCount[node] < 2);
                let u = availableNodes[Math.floor(Math.random() * availableNodes.length)];

                edgeList.push({ source: u, target: v, weight: getRandomWeight() });
                treeNodes.push(v);

                childrenCount[v] = 0;
                childrenCount[u]++;
            }
        }
        else if (treeType === 'binarySearch') {
            // Simulate standard BST insertion logic to get a valid BST structure
            const rootNode = { id: 'rt', val: Math.random(), left: null, right: null };

            for (const v of remaining) {
                let val = Math.random();
                let curr = rootNode;
                while (true) {
                    if (val < curr.val) {
                        if (!curr.left) {
                            curr.left = { id: v, val: val, left: null, right: null };
                            edgeList.push({ source: curr.id, target: v, weight: getRandomWeight() });
                            break;
                        }
                        curr = curr.left;
                    } else {
                        if (!curr.right) {
                            curr.right = { id: v, val: val, left: null, right: null };
                            edgeList.push({ source: curr.id, target: v, weight: getRandomWeight() });
                            break;
                        }
                        curr = curr.right;
                    }
                }
            }
        }
        else if (treeType === 'avl' || treeType === 'redBlack') {
            // AVL and RB are self-balancing (balanced binary tree, max 2 children)
            const balancedNodes = ['rt', ...remaining];

            for (let i = 1; i < balancedNodes.length; i++) {
                let parentIndex = Math.floor((i - 1) / 2);
                let u = balancedNodes[parentIndex];
                let v = balancedNodes[i];

                edgeList.push({ source: u, target: v, weight: getRandomWeight() });
            }
        }
        else if (treeType === 'twoThree') {
            // 2-3 Tree simulation (balanced ternary tree, max 3 children)
            const balancedNodes = ['rt', ...remaining];

            for (let i = 1; i < balancedNodes.length; i++) {
                let parentIndex = Math.floor((i - 1) / 3);
                let u = balancedNodes[parentIndex];
                let v = balancedNodes[i];

                edgeList.push({ source: u, target: v, weight: getRandomWeight() });
            }
        }
        else if (treeType === 'twoThreeFour') {
            // 2-3-4 Tree simulation (balanced quaternary tree, max 4 children)
            const balancedNodes = ['rt', ...remaining];

            for (let i = 1; i < balancedNodes.length; i++) {
                let parentIndex = Math.floor((i - 1) / 4);
                let u = balancedNodes[parentIndex];
                let v = balancedNodes[i];

                edgeList.push({ source: u, target: v, weight: getRandomWeight() });
            }
        }
    }

    graphInputField.value = stringifyEdges(edgeList);
    graphInputVertices.value = vertices.join(', ');
    addGraph();
}

generateRandomButton.addEventListener('click', () => {
    const vertexCount = vertexInput.value;
    if (document.getElementById('genTypeGraph').checked) {
        const edgeCount = edgeInput.value;
        generateRandomGraph(vertexCount, edgeCount);
    } else {
        generateRandomTree(vertexCount);
    }
});

function isTree(edgesInput, directed = true) {
    const edges = parseEdges(edgesInput, directed);
    if (!edges) return false;

    const vertices = new Set();
    edges.forEach(edge => {
        if (edge.source) vertices.add(edge.source);
        if (edge.target) vertices.add(edge.target);
    });

    if (vertices.size <= 1) return edges.length === 0;

    // Rule 1: A tree must have exactly V - 1 edges
    if (edges.length !== vertices.size - 1) {
        return false;
    }

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
            } else if (deg > 1) {
                return false; // A node in a tree can only have one parent
            }
        }

        if (rootCount !== 1) return false;

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

        return visited.size === vertices.size;

    } else {
        // Undirected graph population
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

        return visited.size === vertices.size;
    }
}

function handleGraphNameInput(event, nameInput) {
    if (event.key !== 'Enter') return;

    nameInput.setAttribute('readonly', true);
    nameInput.classList.remove('editable');

    const originalName = nameInput.value;

    if (availableGraphs.includes(originalName)) {
        let counter = 1;
        let newName = originalName;

        while (availableGraphs.includes(newName)) {
            newName = `${originalName}.${String(counter).padStart(3, '0')}`;
            counter++;
        }

        const graphDiv = document.getElementById(originalName);
        if (graphDiv) {
            const input = graphDiv.querySelector('input');
            const labelSpan = document.getElementById(`${originalName}span`);

            if (input) input.value = newName;
            if (labelSpan) labelSpan.textContent = newName;

            availableGraphs.push(newName);
        }
    } else {
        availableGraphs.push(originalName);
    }
}

// Supporting function that will be used to rotate arrows based on edge direction
function smoothFunction(x, k = 0.02, c = 275) {
    const exponent = -k * (x - c);
    const denominator = 1 + Math.exp(exponent);
    const result = 10 - (2.4 / denominator);
    return result;
}

function enableGraphNameEditing(nameInput, displayName) {
    nameInput.removeAttribute('readonly');
    nameInput.classList.add('editable');
    nameInput.focus();

    // Remove the graph name from the global list
    availableGraphs = availableGraphs.filter(graph => graph !== displayName);
}

function deleteGraph(container, displayName) {
    // Remove the container from the DOM
    container.remove();

    // Remove from global list of graph names
    availableGraphs = availableGraphs.filter(graph => graph !== displayName);

    // Remove from the methods list UI
    const methodsEntry = document.getElementById(displayName);
    if (methodsEntry) methodsEntry.remove();

    // Decrement graph count and hide graph options
    graphCount--;
}
