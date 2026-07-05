function visualizeBFS(graphName, startNodeId, container, nodes, edges, svg, arrowId, directed) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }
    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove(); // Clear any old ones
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    // Calculate BFS path
    const queue = [startNodeId];
    const visited = new Set();
    visited.add(startNodeId);

    const levels = {};
    levels[startNodeId] = 0;

    const animationSteps = [];
    animationSteps.push({ type: 'node', id: startNodeId, level: 0, fromEdge: null });

    while (queue.length > 0) {
        const currentId = queue.shift();

        edges.forEach(edge => {
            const sId = edge.source.id || edge.source;
            const tId = edge.target.id || edge.target;

            let isTraversable = false;
            let nextNodeId = null;

            if (sId === currentId && !visited.has(tId)) {
                isTraversable = true;
                nextNodeId = tId;
            } else if ((!directed || edge.bidirectional) && tId === currentId && !visited.has(sId)) {
                isTraversable = true;
                nextNodeId = sId;
            }

            if (isTraversable) {
                visited.add(nextNodeId);
                queue.push(nextNodeId);

                levels[nextNodeId] = levels[currentId] + 1;

                animationSteps.push({ type: 'edge', sourceId: sId, targetId: tId });
                animationSteps.push({
                    type: 'node',
                    id: nextNodeId,
                    level: levels[nextNodeId],
                    fromEdge: { u: sId, v: tId }
                });
            }
        });
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; // ms per step at 1x speed
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        // Build sets of all nodes and edges that should be highlighted up to targetStep
        const activeNodes = new Set();
        const activeEdges = new Set(); // Stored as "sourceId-targetId"

        let logHTML = `<h3 style="color: #ff8a65;">BFS through graph <span style="color: #00759a;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;

        for (let i = 0; i < targetStep; i++) {
            const step = animationSteps[i];
            if (step.type === 'node') activeNodes.add(step.id);
            if (step.type === 'edge') activeEdges.add(`${step.sourceId}-${step.targetId}`);

            if (step.type === 'node') {
                if (step.level === 0) {
                    logHTML += `<div>Started BFS at vertex <span style="color: #ff8a65">${step.id}</span> at level <span style="color: #ff5722">0</span></div><br>`;
                } else {
                    logHTML += `<div>Visited vertex <span style="color: #ff8a65">${step.id}</span> through edge <span style="color: #a3bf60">(${step.fromEdge.u},${step.fromEdge.v})</span> at level <span style="color: #ff5722">${step.level}</span></div><br>`;
                }
            }
        }


        resultLog.innerHTML = logHTML;
        resultLog.scrollTop = resultLog.scrollHeight;


        // Apply Node Colors
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isActive = activeNodes.has(d.id);
            const targetColor = isActive ? nodeVisitColor : nodeColor;

            // Check if this specific node is the one that was JUST added in the current step
            const lastStepIndex = targetStep - 1;
            const isLatestNode = lastStepIndex >= 0 &&
                animationSteps[lastStepIndex].type === 'node' &&
                animationSteps[lastStepIndex].id === d.id;

            if (animate && isLatestNode) {
                el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        // Apply Edge & Arrow Colors
        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const isActive = activeEdges.has(`${sId}-${tId}`);

            const targetColor = isActive ? nodeVisitColor : edgeColor;

            // Update edge path
            if (animate && isActive) {
                el.transition().duration(300).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }

            // Update associated arrow head
            if (directed) {
                const uniqueMarkerId = `${arrowId}-${sId}-${tId}`;
                const markerPath = svg.select(`#${uniqueMarkerId} path`);
                if (!markerPath.empty()) {
                    if (animate && isActive) {
                        markerPath.transition().duration(300).attr('fill', targetColor);
                    } else {
                        markerPath.interrupt().attr('fill', targetColor);
                    }
                }
            }
        });
    };

    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0; // Auto-restart if at end
            playback.updateTimeline(0);
        }

        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const rect = container.getBoundingClientRect();

    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;

    // Instantiate controller
    const playback = new GraphPlaybackController(svg, totalSteps, container,
        {
            onPlay: startLoop,
            onPause: stopLoop,
            onSeek: (step) => {
                currentStep = step;
                renderGraphState(currentStep, false);
            },
            onSpeedChange: () => {
                if (playInterval) {
                    stopLoop();
                    startLoop();
                }
            },
            onEnd: () => {
                stopLoop();
                renderGraphState(0, false);
            }
        });
    startLoop();
    renderGraphState(0, false);
}

function visualizeDFS(graphName, startNodeId, container, nodes, edges, svg, arrowId, directed) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }

    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove(); // Clear any old ones
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    // Calculate DFS path using a Stack
    const stack = [{ id: startNodeId, level: 0, fromEdge: null }];
    const visited = new Set();
    const animationSteps = [];

    while (stack.length > 0) {
        const current = stack.pop();
        const currentId = current.id;

        // In DFS, we check if visited after popping
        if (!visited.has(currentId)) {
            visited.add(currentId);

            // Record edge traversal step if we came from another node
            if (current.fromEdge) {
                animationSteps.push({ type: 'edge', sourceId: current.fromEdge.u, targetId: current.fromEdge.v });
            }

            // Record node visitation step
            animationSteps.push({
                type: 'node',
                id: currentId,
                level: current.level,
                fromEdge: current.fromEdge
            });

            // Gather all valid unvisited neighbors
            const neighbors = [];
            edges.forEach(edge => {
                const sId = edge.source.id || edge.source;
                const tId = edge.target.id || edge.target;

                let isTraversable = false;
                let nextNodeId = null;

                if (sId === currentId && !visited.has(tId)) {
                    isTraversable = true;
                    nextNodeId = tId;
                } else if ((!directed || edge.bidirectional) && tId === currentId && !visited.has(sId)) {
                    isTraversable = true;
                    nextNodeId = sId;
                }

                if (isTraversable) {
                    neighbors.push({
                        id: nextNodeId,
                        level: current.level + 1,
                        fromEdge: { u: sId, v: tId }
                    });
                }
            });

            // Push neighbors to the stack in reverse order 
            // so the first neighbor evaluated is popped first (mimics standard recursive DFS)
            for (let i = neighbors.length - 1; i >= 0; i--) {
                stack.push(neighbors[i]);
            }
        }
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; // ms per step at 1x speed
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        // Build sets of all nodes and edges that should be highlighted up to targetStep
        const activeNodes = new Set();
        const activeEdges = new Set(); // Stored as "sourceId-targetId"

        let logHTML = `<h3 style="color: #ff8a65;">DFS through graph <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;

        for (let i = 0; i < targetStep; i++) {
            const step = animationSteps[i];
            if (step.type === 'node') activeNodes.add(step.id);
            if (step.type === 'edge') activeEdges.add(`${step.sourceId}-${step.targetId}`);

            if (step.type === 'node') {
                if (step.level === 0) {
                    logHTML += `<div>Started DFS at vertex <span style="color: #ff8a65">${step.id}</span> at level <span style="color: #ff5722">0</span></div><br>`;
                } else {
                    logHTML += `<div>Visited vertex <span style="color: #ff8a65">${step.id}</span> through edge <span style="color: #a3bf60">(${step.fromEdge.u},${step.fromEdge.v})</span> at level <span style="color: #ff5722">${step.level}</span></div><br>`;
                }
            }
        }


        resultLog.innerHTML = logHTML;
        resultLog.scrollTop = resultLog.scrollHeight;


        // Apply Node Colors
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isActive = activeNodes.has(d.id);
            const targetColor = isActive ? nodeVisitColor : nodeColor;

            // Check if this specific node is the one that was JUST added in the current step
            const lastStepIndex = targetStep - 1;
            const isLatestNode = lastStepIndex >= 0 &&
                animationSteps[lastStepIndex].type === 'node' &&
                animationSteps[lastStepIndex].id === d.id;

            if (animate && isLatestNode) {
                el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        // Apply Edge & Arrow Colors
        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const isActive = activeEdges.has(`${sId}-${tId}`);

            const targetColor = isActive ? nodeVisitColor : edgeColor;

            // Update edge path
            if (animate && isActive) {
                el.transition().duration(300).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }

            // Update associated arrow head
            if (directed) {
                const uniqueMarkerId = `${arrowId}-${sId}-${tId}`;
                const markerPath = svg.select(`#${uniqueMarkerId} path`);
                if (!markerPath.empty()) {
                    if (animate && isActive) {
                        markerPath.transition().duration(300).attr('fill', targetColor);
                    } else {
                        markerPath.interrupt().attr('fill', targetColor);
                    }
                }
            }
        });
    };

    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0; // Auto-restart if at end
            playback.updateTimeline(0);
        }

        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const rect = container.getBoundingClientRect();

    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;

    // Instantiate controller
    const playback = new GraphPlaybackController(svg, totalSteps, container,
        {
            onPlay: startLoop,
            onPause: stopLoop,
            onSeek: (step) => {
                currentStep = step;
                renderGraphState(currentStep, false);
            },
            onSpeedChange: () => {
                if (playInterval) {
                    stopLoop();
                    startLoop();
                }
            },
            onEnd: () => {
                stopLoop();
                renderGraphState(0, false);
            }
        });

    startLoop();
    renderGraphState(0, false);
}

function visualizeDijkstra(graphName, startNodeId, container, nodes, edges, svg, arrowId, directed) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }

    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    // Initialize Dijkstra's requirements
    const distances = {};
    nodes.forEach(n => {
        const nId = n.id !== undefined ? n.id : n;
        distances[nId] = Infinity;
    });
    distances[startNodeId] = 0;

    // Use the custom PriorityQueue
    const pq = new PriorityQueue();
    pq.enqueue({ id: startNodeId, fromEdge: null }, 0);

    const visited = new Set();
    const animationSteps = [];

    while (!pq.isEmpty()) {
        const current = pq.dequeue();
        const u = current.element.id;
        const currentDist = current.priority;
        const fromEdge = current.element.fromEdge;

        // Skip if we've already finalized the shortest path to this node
        if (visited.has(u)) continue;

        visited.add(u);

        // Record the edge that successfully relaxed this node
        if (fromEdge) {
            animationSteps.push({ type: 'edge', sourceId: fromEdge.u, targetId: fromEdge.v });
        }

        // Record the node visitation (finalized shortest path)
        animationSteps.push({
            type: 'node',
            id: u,
            dist: currentDist,
            fromEdge: fromEdge
        });

        // Evaluate all neighbors
        for (const { source, target, weight } of edges) {
            const sId = source.id !== undefined ? source.id : source;
            const tId = target.id !== undefined ? target.id : target;
            const edgeWeight = weight !== undefined ? weight : 1;

            let isTraversable = false;
            let v = null;
            let edgeU = null;
            let edgeV = null;

            if (sId === u) {
                isTraversable = true;
                v = tId;
                edgeU = sId; edgeV = tId;
            } else if ((!directed || edges.bidirectional) && tId === u) {
                isTraversable = true;
                v = sId;
                edgeU = tId; edgeV = sId;
            }

            if (isTraversable && !visited.has(v)) {
                const alt = distances[u] + edgeWeight;

                // Relaxation step
                if (alt < distances[v]) {
                    distances[v] = alt;
                    pq.enqueue({ id: v, fromEdge: { u: edgeU, v: edgeV, weight: edgeWeight } }, alt);
                }
            }
        }
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; // ms per step at 1x speed
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        const activeNodes = new Set();
        const activeEdges = new Set();

        let logHTML = `<h3 style="color: #ff8a65;">Dijkstra's Algorithm through graph <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;

        for (let i = 0; i < targetStep; i++) {
            const step = animationSteps[i];
            if (step.type === 'node') activeNodes.add(step.id);
            if (step.type === 'edge') activeEdges.add(`${step.sourceId}-${step.targetId}`);

            if (step.type === 'node') {
                if (step.dist === 0) {
                    logHTML += `<div>Started at vertex <span style="color: #ff8a65">${step.id}</span> (Distance: <span style="color: #ff5722">0</span>)</div><br>`;
                } else {
                    logHTML += `<div>Finalized vertex <span style="color: #ff8a65">${step.id}</span> via edge <span style="color: #a3bf60">(${step.fromEdge.u},${step.fromEdge.v})</span> [w: ${step.fromEdge.weight}] - Total Dist: <span style="color: #ff5722">${step.dist}</span></div><br>`;
                }
            }
        }


        resultLog.innerHTML = logHTML;
        resultLog.scrollTop = resultLog.scrollHeight;


        // Apply Node Colors
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isActive = activeNodes.has(d.id);
            const targetColor = isActive ? nodeVisitColor : nodeColor;

            const lastStepIndex = targetStep - 1;
            const isLatestNode = lastStepIndex >= 0 &&
                animationSteps[lastStepIndex].type === 'node' &&
                animationSteps[lastStepIndex].id === d.id;

            if (animate && isLatestNode) {
                el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        // Apply Edge & Arrow Colors
        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const isActive = activeEdges.has(`${sId}-${tId}`);

            const targetColor = isActive ? nodeVisitColor : edgeColor;

            if (animate && isActive) {
                el.transition().duration(300).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }

            if (directed) {
                const uniqueMarkerId = `${arrowId}-${sId}-${tId}`;
                const markerPath = svg.select(`#${uniqueMarkerId} path`);
                if (!markerPath.empty()) {
                    if (animate && isActive) {
                        markerPath.transition().duration(300).attr('fill', targetColor);
                    } else {
                        markerPath.interrupt().attr('fill', targetColor);
                    }
                }
            }
        });
    };

    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }

        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const rect = container.getBoundingClientRect();
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;

    const playback = new GraphPlaybackController(svg, totalSteps, container,
        {
            onPlay: startLoop,
            onPause: stopLoop,
            onSeek: (step) => {
                currentStep = step;
                renderGraphState(currentStep, false);
            },
            onSpeedChange: () => {
                if (playInterval) {
                    stopLoop();
                    startLoop();
                }
            },
            onEnd: () => {
                stopLoop();
                renderGraphState(0, false);
            }
        });

    startLoop();
    renderGraphState(0, false);
}

function visualizeFloydWarshall(graphName, startNodeId, container, nodes, edges, svg, arrowId, directed) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }

    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    const nodeIds = nodes.map(n => n.id !== undefined ? n.id : n);

    const dist = {};
    nodeIds.forEach(u => {
        dist[u] = {};
        nodeIds.forEach(v => {
            dist[u][v] = (u === v) ? 0 : Infinity;
        });
    });

    // Populate matrix
    edges.forEach(edge => {
        const u = edge.source.id !== undefined ? edge.source.id : edge.source;
        const v = edge.target.id !== undefined ? edge.target.id : edge.target;
        const weight = edge.weight !== undefined ? edge.weight : 1;

        dist[u][v] = Math.min(dist[u][v], weight);
        if (!directed || edge.bidirectional) {
            dist[v][u] = Math.min(dist[v][u], weight);
        }
    });

    const animationSteps = [];

    nodeIds.forEach(k => {
        // Record phase transition
        animationSteps.push({ type: 'pivot', k: k });

        nodeIds.forEach(i => {
            nodeIds.forEach(j => {
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    const alt = dist[i][k] + dist[k][j];
                    if (alt < dist[i][j]) {
                        const oldDist = dist[i][j];
                        dist[i][j] = alt;

                        // Record successful relaxation
                        animationSteps.push({
                            type: 'relax',
                            k: k,
                            i: i,
                            j: j,
                            oldDist: oldDist,
                            newDist: alt
                        });
                    }
                }
            });
        });
    });

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; // ms per step at 1x speed
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        let currentActiveNodes = new Set();

        let logHTML = `<h3 style="color: #ff8a65;">Floyd-Warshall (All-Pairs) on <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;

        for (let idx = 0; idx < targetStep; idx++) {
            const step = animationSteps[idx];

            // Build logging history
            if (step.type === 'pivot') {
                logHTML += `<div style="margin-top: 10px;"><strong>Phase:</strong> Evaluating intermediate node <span style="color: #ff8a65">${step.k}</span></div>`;
            } else if (step.type === 'relax') {
                const oldStr = step.oldDist === Infinity ? '∞' : step.oldDist;
                logHTML += `<div>Relaxed <span style="color: #a3bf60">${step.i} &rarr; ${step.j}</span> via <span style="color: #ff8a65">${step.k}</span> (Dist: ${oldStr} &rarr; <span style="color: #ff5722">${step.newDist}</span>)</div><br>`;
            }

            // Highlight the nodes involved in the exact CURRENT step.
            if (idx === targetStep - 1) {
                if (step.type === 'pivot') {
                    currentActiveNodes.add(step.k);
                } else if (step.type === 'relax') {
                    currentActiveNodes.add(step.k);
                    currentActiveNodes.add(step.i);
                    currentActiveNodes.add(step.j);
                }
            }
        }


        resultLog.innerHTML = logHTML;
        resultLog.scrollTop = resultLog.scrollHeight;


        // Apply Node Colors based on CURRENT frame isolated state
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isActive = currentActiveNodes.has(d.id);
            const targetColor = isActive ? nodeVisitColor : nodeColor;

            if (animate && isActive) {
                el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        // Keep all edges static
        svg.selectAll('.link').interrupt().attr('stroke', edgeColor);
        if (directed) {
            svg.selectAll(`[id^="${arrowId}"] path`).interrupt().attr('fill', edgeColor);
        }
    };

    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }

        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const rect = container.getBoundingClientRect();
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;

    const playback = new GraphPlaybackController(svg, totalSteps, container,
        {
            onPlay: startLoop,
            onPause: stopLoop,
            onSeek: (step) => {
                currentStep = step;
                renderGraphState(currentStep, false);
            },
            onSpeedChange: () => {
                if (playInterval) {
                    stopLoop();
                    startLoop();
                }
            },
            onEnd: () => {
                stopLoop();
                renderGraphState(0, false);
            }
        });

    startLoop();
    renderGraphState(0, false);
}

function visualizeBellmanFord(graphName, startNodeId, container, nodes, edges, svg, arrowId, directed) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }

    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    const nodeIds = nodes.map(n => n.id !== undefined ? n.id : n);
    const V = nodeIds.length;

    const distances = {};
    nodeIds.forEach(id => distances[id] = Infinity);
    distances[startNodeId] = 0;

    const animationSteps = [];

    // Helper for edge evaluation
    const evaluateEdge = (u, v, weight) => {
        animationSteps.push({
            type: 'eval',
            u: u,
            v: v,
            w: weight,
            distU: distances[u],
            distV: distances[v]
        });

        if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
            distances[v] = distances[u] + weight;
            animationSteps.push({
                type: 'relax',
                u: u,
                v: v,
                newDist: distances[v]
            });
            return true;
        }
        return false;
    };

    // Relax all edges V - 1 times
    let cycleCheckNeeded = true;

    for (let i = 1; i < V; i++) {
        animationSteps.push({ type: 'phase', phase: i, total: V - 1 });
        let relaxedInThisPhase = false;

        for (const edge of edges) {
            const u = edge.source.id !== undefined ? edge.source.id : edge.source;
            const v = edge.target.id !== undefined ? edge.target.id : edge.target;
            const weight = edge.weight !== undefined ? edge.weight : 1;

            const relaxed = evaluateEdge(u, v, weight);
            if (relaxed) relaxedInThisPhase = true;

            // Handle bidirectional/undirected edges
            if (!directed || edge.bidirectional) {
                const relaxedReverse = evaluateEdge(v, u, weight);
                if (relaxedReverse) relaxedInThisPhase = true;
            }
        }

        // Optimization: If no distances were updated, shortest paths are finalized.
        if (!relaxedInThisPhase) {
            animationSteps.push({ type: 'early_stop', phase: i });
            cycleCheckNeeded = false;
            break;
        }
    }

    // Check for negative-weight cycles
    if (cycleCheckNeeded) {
        animationSteps.push({ type: 'cycle_check' });
        for (const edge of edges) {
            const u = edge.source.id !== undefined ? edge.source.id : edge.source;
            const v = edge.target.id !== undefined ? edge.target.id : edge.target;
            const weight = edge.weight !== undefined ? edge.weight : 1;

            if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
                animationSteps.push({ type: 'cycle_found', u: u, v: v });
                break;
            }
            if ((!directed || edge.bidirectional) && distances[v] !== Infinity && distances[v] + weight < distances[u]) {
                animationSteps.push({ type: 'cycle_found', u: v, v: u });
                break;
            }
        }
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; // ms per step
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        let currentActiveNodes = new Set();
        let currentActiveEdges = new Set();
        let isRelaxing = false;

        let logHTML = `<h3 style="color: #ff8a65;">Bellman-Ford on <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;

        for (let idx = 0; idx < targetStep; idx++) {
            const step = animationSteps[idx];

            // Build logging history
            if (step.type === 'phase') {
                logHTML += `<div style="margin-top: 15px;"><strong>Pass <span style="color: #ff5722">${step.phase}</span> of ${step.total}:</strong> Relaxing all edges</div>`;
            } else if (step.type === 'eval') {
                const distUStr = step.distU === Infinity ? '∞' : step.distU;
                const distVStr = step.distV === Infinity ? '∞' : step.distV;
                logHTML += `<div>Eval <span style="color: #a3bf60">${step.u} &rarr; ${step.v}</span> (w: ${step.w}) | Dist[${step.u}]=${distUStr}, Dist[${step.v}]=${distVStr}</div>`;
            } else if (step.type === 'relax') {
                logHTML += `<div style="padding-left: 10px; color: #ff5722;">↳ Relaxed! New Dist[${step.v}] = ${step.newDist}</div><br>`;
            } else if (step.type === 'early_stop') {
                logHTML += `<div style="color: #a3bf60; margin-top: 15px;"><strong>Early Stop:</strong> No relaxations in Pass ${step.phase}. Algorithm complete!</div>`;
            } else if (step.type === 'cycle_check') {
                logHTML += `<div style="margin-top: 15px;"><strong>Final Pass:</strong> Checking for negative-weight cycles...</div>`;
            } else if (step.type === 'cycle_found') {
                logHTML += `<div style="color: #ff5722; font-weight: bold;">Error: Negative-weight cycle detected involving ${step.u} &rarr; ${step.v}!</div>`;
            }

            // Isolate active highlights to the exact current frame
            if (idx === targetStep - 1) {
                if (step.type === 'eval' || step.type === 'relax' || step.type === 'cycle_found') {
                    currentActiveNodes.add(step.u);
                    currentActiveNodes.add(step.v);
                    currentActiveEdges.add(`${step.u}-${step.v}`);
                    if (step.type === 'relax' || step.type === 'cycle_found') {
                        isRelaxing = true;
                    }
                }
            }
        }

        resultLog.innerHTML = logHTML;
        resultLog.scrollTop = resultLog.scrollHeight;


        // Dynamic Colors: standard highlight for 'eval', visit/accent color for 'relax'
        const highlightColor = isRelaxing ? nodeVisitColor : edgeEvalColor;
        const baseEdgeColor = edgeColor;
        const baseNodeColor = nodeColor;

        // Apply Node Colors
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isActive = currentActiveNodes.has(d.id);
            const targetColor = isActive ? highlightColor : baseNodeColor;

            if (animate && isActive) {
                el.transition().duration(200).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        // Apply Edge & Arrow Colors
        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const isActive = currentActiveEdges.has(`${sId}-${tId}`);

            const targetColor = isActive ? highlightColor : baseEdgeColor;

            if (animate && isActive) {
                el.transition().duration(200).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }

            if (directed) {
                const uniqueMarkerId = `${arrowId}-${sId}-${tId}`;
                const markerPath = svg.select(`#${uniqueMarkerId} path`);
                if (!markerPath.empty()) {
                    if (animate && isActive) {
                        markerPath.transition().duration(200).attr('fill', targetColor);
                    } else {
                        markerPath.interrupt().attr('fill', targetColor);
                    }
                }
            }
        });
    };

    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }

        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const rect = container.getBoundingClientRect();
    const playback = new GraphPlaybackController(svg, totalSteps, container,
        {
            onPlay: startLoop,
            onPause: stopLoop,
            onSeek: (step) => {
                currentStep = step;
                renderGraphState(currentStep, false);
            },
            onSpeedChange: () => {
                if (playInterval) {
                    stopLoop();
                    startLoop();
                }
            },
            onEnd: () => {
                stopLoop();
                renderGraphState(0, false);
            }
        });

    startLoop();
    renderGraphState(0, false);
}

function visualizeKruskal(graphName, container, nodes, edges, svg, arrowId) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }
    
    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    const nodeIds = nodes.map(n => n.id !== undefined ? n.id : n);
    const V = nodeIds.length;

    // Disjoint Set Union (DSU) for cycle detection
    class DSU {
        constructor(elements) {
            this.parent = {};
            elements.forEach(e => this.parent[e] = e);
        }
        find(i) {
            if (this.parent[i] === i) return i;
            return this.parent[i] = this.find(this.parent[i]); 
        }
        union(i, j) {
            const rootI = this.find(i);
            const rootJ = this.find(j);
            if (rootI !== rootJ) {
                this.parent[rootI] = rootJ;
                return true; 
            }
            return false; 
        }
    }

    const dsu = new DSU(nodeIds);
    const animationSteps = [];

    const sortedEdges = [...edges].sort((a, b) => {
        const wA = a.weight !== undefined ? a.weight : 1;
        const wB = b.weight !== undefined ? b.weight : 1;
        return wA - wB;
    });

    let edgesAccepted = 0;
    
    for (const edge of sortedEdges) {
        const u = edge.source.id !== undefined ? edge.source.id : edge.source;
        const v = edge.target.id !== undefined ? edge.target.id : edge.target;
        const w = edge.weight !== undefined ? edge.weight : 1;

        animationSteps.push({ type: 'eval', u: u, v: v, w: w });

        if (dsu.union(u, v)) {
            animationSteps.push({ type: 'accept', u: u, v: v, w: w });
            edgesAccepted++;
            
            if (edgesAccepted === V - 1) {
                animationSteps.push({ type: 'complete' });
                break; 
            }
        } else {
            animationSteps.push({ type: 'reject', u: u, v: v, w: w });
        }
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; 
    let currentStep = 0;
    let playInterval = null;

    const renderGraphState = (targetStep, animate = false) => {
        const mstEdges = new Set();
        const mstNodes = new Set();
        let evaluatingEdge = null;
        let rejectEdge = null;
        
        let logHTML = `<h3 style="color: #ff8a65;">Kruskal's MST on <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;
        logHTML += `<div style="margin-bottom: 10px;"><em>Edges sorted by weight. Evaluating...</em></div>`;

        let totalWeight = 0;

        for (let idx = 0; idx < targetStep; idx++) {
            const step = animationSteps[idx];
            
            if (step.type === 'eval') {
                logHTML += `<div>Evaluating edge <span style="color: #a3bf60">${step.u} - ${step.v}</span> (w: ${step.w})...</div>`;
                evaluatingEdge = `${step.u}-${step.v}`;
            } else if (step.type === 'accept') {
                logHTML += `<div style="padding-left: 10px; color: #a3bf60;">↳ Accepted! Does not form a cycle.</div><br>`;
                mstEdges.add(`${step.u}-${step.v}`);
                mstEdges.add(`${step.v}-${step.u}`);
                mstNodes.add(step.u);
                mstNodes.add(step.v);
                totalWeight += step.w;
                evaluatingEdge = null;
            } else if (step.type === 'reject') {
                logHTML += `<div style="padding-left: 10px; color: #ff5722;">↳ Rejected! Forms a cycle.</div><br>`;
                rejectEdge = `${step.u}-${step.v}`;
                evaluatingEdge = null;
            } else if (step.type === 'complete') {
                logHTML += `<div style="color: #ff8a65; margin-top: 10px; font-weight: bold;">MST Complete! Total Weight: ${totalWeight}</div>`;
            }

            if (idx !== targetStep - 1) {
                evaluatingEdge = null;
                rejectEdge = null;
            }
        }

        if (typeof resultLog !== 'undefined') {
            resultLog.innerHTML = logHTML;
            resultLog.scrollTop = resultLog.scrollHeight; 
        }

        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isActive = mstNodes.has(d.id);
            const targetColor = isActive ? nodeVisitColor : nodeColor;

            if (animate && isActive && targetStep > 0 && animationSteps[targetStep-1].type === 'accept' && (animationSteps[targetStep-1].u === d.id || animationSteps[targetStep-1].v === d.id)) {
                el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const edgeKey = `${sId}-${tId}`;
            const reverseEdgeKey = `${tId}-${sId}`;
            
            const isMST = mstEdges.has(edgeKey) || mstEdges.has(reverseEdgeKey);
            const isEval = evaluatingEdge === edgeKey || evaluatingEdge === reverseEdgeKey;
            const isReject = rejectEdge === edgeKey || rejectEdge === reverseEdgeKey;

            let targetColor = edgeColor;

            if (isMST) {
                targetColor = nodeVisitColor;
            } else if (isEval) {
                targetColor = edgeEvalColor; 
            } else if (isReject) {
                targetColor = errorColor; 
            }

            if (animate) {
                el.transition().duration(200).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }
        });
    };
    
    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }
        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const playback = new GraphPlaybackController(svg, totalSteps, container, {
        onPlay: startLoop,
        onPause: stopLoop,
        onSeek: (step) => {
            currentStep = step;
            renderGraphState(currentStep, false);
        },
        onSpeedChange: () => {
            if (playInterval) { stopLoop(); startLoop(); }
        },
        onEnd: () => {
            stopLoop(); renderGraphState(0, false);
        }
    });
    
    startLoop();
    renderGraphState(0, false);
}

function visualizePrim(graphName, container, nodes, edges, svg, arrowId) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }
    
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    const nodeIds = nodes.map(n => n.id !== undefined ? n.id : n);
    const V = nodeIds.length;
    if (V === 0) return;

    // Build undirected adjacency list
    const adj = {};
    nodeIds.forEach(id => adj[id] = []);
    edges.forEach(edge => {
        const u = edge.source.id !== undefined ? edge.source.id : edge.source;
        const v = edge.target.id !== undefined ? edge.target.id : edge.target;
        const w = edge.weight !== undefined ? edge.weight : 1;
        adj[u].push({ to: v, weight: w });
        adj[v].push({ to: u, weight: w });
    });

    const animationSteps = [];
    
    // Auto-select the first node to begin the tree
    const startNode = nodeIds[0];
    const visited = new Set([startNode]);
    animationSteps.push({ type: 'start', node: startNode });

    const pq = new PriorityQueue();
    adj[startNode].forEach(edge => {
        pq.enqueue({ u: startNode, v: edge.to, weight: edge.weight }, edge.weight);
    });

    let edgesAccepted = 0;

    while (!pq.isEmpty() && edgesAccepted < V - 1) {
        const { element } = pq.dequeue();
        const { u, v, weight } = element;

        animationSteps.push({ type: 'eval', u: u, v: v, w: weight });

        // If both nodes are already in the MST, skip (cycle)
        if (visited.has(u) && visited.has(v)) {
            animationSteps.push({ type: 'reject', u: u, v: v, w: weight });
            continue;
        }

        // Accept the edge and add the unvisited node
        const newNode = visited.has(u) ? v : u;
        visited.add(newNode);
        edgesAccepted++;
        
        animationSteps.push({ type: 'accept', u: u, v: v, w: weight, newNode: newNode });

        if (edgesAccepted === V - 1) {
            animationSteps.push({ type: 'complete' });
            break;
        }

        // Enqueue neighbors of the newly added node
        adj[newNode].forEach(edge => {
            if (!visited.has(edge.to)) {
                pq.enqueue({ u: newNode, v: edge.to, weight: edge.weight }, edge.weight);
            }
        });
    }

    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; 
    let currentStep = 0;
    let playInterval = null;

    const renderGraphState = (targetStep, animate = false) => {
        const mstEdges = new Set();
        const mstNodes = new Set();
        let evaluatingEdge = null;
        let rejectEdge = null;
        
        let logHTML = `<h3 style="color: #ff8a65;">Prim's MST on <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;
        let totalWeight = 0;

        for (let idx = 0; idx < targetStep; idx++) {
            const step = animationSteps[idx];
            
            if (step.type === 'start') {
                logHTML += `<div>Started growing tree from node <span style="color: #ff8a65">${step.node}</span></div><br>`;
                mstNodes.add(step.node);
            } else if (step.type === 'eval') {
                logHTML += `<div>Evaluating frontier edge <span style="color: #a3bf60">${step.u} - ${step.v}</span> (w: ${step.w})...</div>`;
                evaluatingEdge = `${step.u}-${step.v}`;
            } else if (step.type === 'accept') {
                logHTML += `<div style="padding-left: 10px; color: #a3bf60;">↳ Accepted! Added node ${step.newNode} to MST.</div><br>`;
                mstEdges.add(`${step.u}-${step.v}`);
                mstEdges.add(`${step.v}-${step.u}`);
                mstNodes.add(step.u);
                mstNodes.add(step.v);
                totalWeight += step.w;
                evaluatingEdge = null;
            } else if (step.type === 'reject') {
                logHTML += `<div style="padding-left: 10px; color: #ff5722;">↳ Rejected! Both nodes already in MST.</div><br>`;
                rejectEdge = `${step.u}-${step.v}`;
                evaluatingEdge = null;
            } else if (step.type === 'complete') {
                logHTML += `<div style="color: #ff8a65; margin-top: 10px; font-weight: bold;">MST Complete! Total Weight: ${totalWeight}</div>`;
            }

            if (idx !== targetStep - 1) {
                evaluatingEdge = null;
                rejectEdge = null;
            }
        }

        if (typeof resultLog !== 'undefined') {
            resultLog.innerHTML = logHTML;
            resultLog.scrollTop = resultLog.scrollHeight; 
        }

        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isActive = mstNodes.has(d.id);
            const targetColor = isActive ? nodeVisitColor : nodeColor;

            if (animate && isActive && targetStep > 0 && animationSteps[targetStep-1].type === 'accept' && animationSteps[targetStep-1].newNode === d.id) {
                el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const edgeKey = `${sId}-${tId}`;
            const reverseEdgeKey = `${tId}-${sId}`;
            
            const isMST = mstEdges.has(edgeKey) || mstEdges.has(reverseEdgeKey);
            const isEval = evaluatingEdge === edgeKey || evaluatingEdge === reverseEdgeKey;
            const isReject = rejectEdge === edgeKey || rejectEdge === reverseEdgeKey;

            let targetColor = edgeColor;

            if (isMST) {
                targetColor = nodeVisitColor;
            } else if (isEval) {
                targetColor = edgeEvalColor; 
            } else if (isReject) {
                targetColor = errorColor; 
            }

            if (animate) {
                el.transition().duration(200).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }
        });
    };
    
    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }
        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const playback = new GraphPlaybackController(svg, totalSteps, container, {
        onPlay: startLoop,
        onPause: stopLoop,
        onSeek: (step) => {
            currentStep = step;
            renderGraphState(currentStep, false);
        },
        onSpeedChange: () => {
            if (playInterval) { stopLoop(); startLoop(); }
        },
        onEnd: () => {
            stopLoop(); renderGraphState(0, false);
        }
    });
    
    startLoop();
    renderGraphState(0, false);
}

function visualizeTopologicalSort(graphName, container, nodes, edges, svg, arrowId, directed) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }
    
    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    const nodeIds = nodes.map(n => n.id !== undefined ? n.id : n);
    const V = nodeIds.length;

    // Calculate In-Degrees and build Adjacency List
    const inDegree = {};
    const adj = {};
    nodeIds.forEach(id => {
        inDegree[id] = 0;
        adj[id] = [];
    });

    edges.forEach(edge => {
        const u = edge.source.id !== undefined ? edge.source.id : edge.source;
        const v = edge.target.id !== undefined ? edge.target.id : edge.target;
        
        // Only process as directed. Topo sort on undirected graphs isn't valid.
        adj[u].push(v);
        inDegree[v]++;
    });

    const animationSteps = [];
    const queue = [];
    
    // Find all nodes with 0 in-degree
    nodeIds.forEach(id => {
        if (inDegree[id] === 0) queue.push(id);
    });

    animationSteps.push({ type: 'init', initialQueue: [...queue] });

    let processedCount = 0;
    const sortedOrder = [];

    // Process the queue (Kahn's Algorithm)
    while (queue.length > 0) {
        const u = queue.shift();
        sortedOrder.push(u);
        processedCount++;

        animationSteps.push({ type: 'process_node', u: u, currentOrder: [...sortedOrder] });

        adj[u].forEach(v => {
            animationSteps.push({ type: 'eval_edge', u: u, v: v });
            
            inDegree[v]--;
            if (inDegree[v] === 0) {
                queue.push(v);
                animationSteps.push({ type: 'enqueue', v: v });
            }
        });
    }

    // Check for cycles
    if (processedCount !== V) {
        animationSteps.push({ type: 'cycle_error' });
    } else {
        animationSteps.push({ type: 'complete', finalOrder: sortedOrder });
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; 
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        const completedNodes = new Set();
        let evaluatingNode = null;
        let evaluatingEdge = null;
        let enqueueNode = null;
        
        let logHTML = `<h3 style="color: #ff8a65;">Topological Sort (Kahn's) on <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;
        let currentTopoOrder = [];

        for (let idx = 0; idx < targetStep; idx++) {
            const step = animationSteps[idx];
            
            if (step.type === 'init') {
                logHTML += `<div><strong>Initialization:</strong> Nodes with 0 in-degree: [ <span style="color: #a3bf60">${step.initialQueue.join(', ')}</span> ]</div><br>`;
            } else if (step.type === 'process_node') {
                logHTML += `<div>Processing node <span style="color: #ff8a65">${step.u}</span>...</div>`;
                evaluatingNode = step.u;
                completedNodes.add(step.u);
                currentTopoOrder = step.currentOrder;
            } else if (step.type === 'eval_edge') {
                logHTML += `<div style="padding-left: 10px;">↳ Removing edge <span style="color: #ff5722">${step.u} &rarr; ${step.v}</span> (Decrements ${step.v}'s in-degree)</div>`;
                evaluatingEdge = `${step.u}-${step.v}`;
            } else if (step.type === 'enqueue') {
                logHTML += `<div style="padding-left: 10px; color: #a3bf60;">↳ Node ${step.v} now has 0 in-degree. Added to queue!</div>`;
                enqueueNode = step.v;
            } else if (step.type === 'cycle_error') {
                logHTML += `<br><div style="color: #e74c3c; font-weight: bold;">Error: Cycle detected! A valid topological ordering is impossible.</div>`;
            } else if (step.type === 'complete') {
                logHTML += `<br><div style="color: #ff8a65; font-weight: bold;">Sort Complete!</div>`;
            }

            // Reset ephemeral visual states if we aren't on the exact frame
            if (idx !== targetStep - 1) {
                evaluatingNode = null;
                evaluatingEdge = null;
                enqueueNode = null;
            }
        }

        // Always show the running topological order at the bottom
        if (targetStep > 0 && currentTopoOrder.length > 0) {
            logHTML += `<div style="margin-top: 15px; padding: 10px; background: rgba(0,0,0,0.2); border-left: 3px solid #ff5722;">
                <strong>Current Order:</strong> <span style="color: #a3bf60">[ ${currentTopoOrder.join(' &rarr; ')} ]</span>
            </div>`;
        }

        if (typeof resultLog !== 'undefined') {
            resultLog.innerHTML = logHTML;
            resultLog.scrollTop = resultLog.scrollHeight; 
        }

        // Apply Node Colors
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isCompleted = completedNodes.has(d.id);
            const isEvaluating = evaluatingNode === d.id;
            const isEnqueueing = enqueueNode === d.id;

            let targetColor = nodeColor;
            if (isEvaluating) targetColor = edgeEvalColor;
            else if (isEnqueueing) targetColor = '#a3bf60';
            else if (isCompleted) targetColor = nodeVisitColor;

            if (animate && (isEvaluating || isEnqueueing || (isCompleted && targetStep > 0 && animationSteps[targetStep-1].type === 'process_node'))) {
                el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        // Apply Edge Colors
        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const edgeKey = `${sId}-${tId}`;
            
            const isEval = evaluatingEdge === edgeKey;
            
            // Fade out edges that belong to completed nodes to visually represent "removing" them
            const isRemoved = completedNodes.has(sId) && !isEval; 

            let targetColor = isRemoved ? 'rgba(255,255,255,0.1)' : edgeColor;

            if (isEval) {
                targetColor = edgeEvalColor; 
            }

            if (animate) {
                el.transition().duration(200).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }

            // Arrowheads
            if (directed) {
                const uniqueMarkerId = `${arrowId}-${sId}-${tId}`;
                const markerPath = svg.select(`#${uniqueMarkerId} path`);
                if (!markerPath.empty()) {
                    if (animate) {
                        markerPath.transition().duration(200).attr('fill', targetColor);
                    } else {
                        markerPath.interrupt().attr('fill', targetColor);
                    }
                }
            }
        });
    };
    
    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }
        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const playback = new GraphPlaybackController(svg, totalSteps, container, {
        onPlay: startLoop,
        onPause: stopLoop,
        onSeek: (step) => {
            currentStep = step;
            renderGraphState(currentStep, false);
        },
        onSpeedChange: () => {
            if (playInterval) { stopLoop(); startLoop(); }
        },
        onEnd: () => {
            stopLoop(); renderGraphState(0, false);
        }
    });
    
    startLoop();
    renderGraphState(0, false);
}

function visualizeSCC(graphName, container, nodes, edges, svg, arrowId, directed) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }
    
    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    const nodeIds = nodes.map(n => n.id !== undefined ? n.id : n);
    const V = nodeIds.length;

    // Build directed adjacency list
    const adj = {};
    nodeIds.forEach(id => adj[id] = []);
    edges.forEach(edge => {
        const u = edge.source.id !== undefined ? edge.source.id : edge.source;
        const v = edge.target.id !== undefined ? edge.target.id : edge.target;
        adj[u].push(v);
        // SCC is strictly for directed graphs, so we don't add the reverse edge.
    });

    // Tarjan's Algorithm State
    let idCounter = 0;
    const ids = {};
    const low = {};
    const onStack = new Set();
    const stack = [];
    
    nodeIds.forEach(id => ids[id] = -1); // -1 signifies unvisited

    const animationSteps = [];
    let sccCount = 0;

    // DFS for Tarjan's
    function dfs(at) {
        stack.push(at);
        onStack.add(at);
        ids[at] = idCounter;
        low[at] = idCounter;
        idCounter++;

        animationSteps.push({ type: 'visit', u: at, id: ids[at], low: low[at], stackState: [...stack] });

        for (const to of adj[at]) {
            animationSteps.push({ type: 'eval_edge', u: at, v: to });

            if (ids[to] === -1) {
                // Unvisited neighbor
                dfs(to);
                low[at] = Math.min(low[at], low[to]);
                animationSteps.push({ type: 'update_low', u: at, v: to, newLow: low[at] });
            } else if (onStack.has(to)) {
                // Back-edge found
                low[at] = Math.min(low[at], ids[to]);
                animationSteps.push({ type: 'update_low_back', u: at, v: to, newLow: low[at] });
            }
        }

        // Check if we are at the root of an SCC
        if (ids[at] === low[at]) {
            const sccNodes = [];
            let node;
            do {
                node = stack.pop();
                onStack.delete(node);
                sccNodes.push(node);
            } while (node !== at);

            animationSteps.push({ 
                type: 'scc_found', 
                root: at, 
                nodes: sccNodes, 
                sccIndex: sccCount,
                stackState: [...stack]
            });
            sccCount++;
        }
    }

    // Run Tarjan's on all unvisited nodes
    for (const node of nodeIds) {
        if (ids[node] === -1) {
            dfs(node);
        }
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; 
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        let currentStack = new Set();
        let resolvedSCCs = {}; // nodeId -> color
        let evaluatingEdge = null;
        let activeNode = null;
        
        let logHTML = `<h3 style="color: #ff8a65;">Tarjan's SCC on <span style="color: #ff5722;">${graphName}</span></h3><div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>`;

        for (let idx = 0; idx < targetStep; idx++) {
            const step = animationSteps[idx];
            
            if (step.type === 'visit') {
                logHTML += `<div>Discovered node <span style="color: #ff8a65">${step.u}</span> [id: ${step.id}, low: ${step.low}]. Added to Stack.</div>`;
                currentStack = new Set(step.stackState);
                activeNode = step.u;
            } else if (step.type === 'eval_edge') {
                logHTML += `<div style="padding-left: 10px;">Evaluating edge <span style="color: #a3bf60">${step.u} &rarr; ${step.v}</span>...</div>`;
                evaluatingEdge = `${step.u}-${step.v}`;
                activeNode = step.u;
            } else if (step.type === 'update_low') {
                logHTML += `<div style="padding-left: 10px; color: #ff5722;">↳ Returned from ${step.v}. Updated ${step.u}'s low-link to ${step.newLow}.</div><br>`;
                activeNode = step.u;
            } else if (step.type === 'update_low_back') {
                logHTML += `<div style="padding-left: 10px; color: #ff5722;">↳ Back-edge to stack node ${step.v}! Updated ${step.u}'s low-link to ${step.newLow}.</div><br>`;
                activeNode = step.u;
            } else if (step.type === 'scc_found') {
                logHTML += `<div style="margin-top: 10px; padding: 5px; background: rgba(0,0,0,0.2); border-left: 3px solid ${disColors[step.sccIndex % disColors.length]};">
                    <strong>SCC Found!</strong> Root: ${step.root}. Nodes popped: [ <span style="color: #a3bf60">${step.nodes.join(', ')}</span> ]
                </div><br>`;
                currentStack = new Set(step.stackState);
                
                // Assign color to all nodes in this SCC
                const color = disColors[step.sccIndex % disColors.length];
                step.nodes.forEach(n => resolvedSCCs[n] = color);
                activeNode = null;
            }

            // Reset ephemeral state if not on current step
            if (idx !== targetStep - 1) {
                evaluatingEdge = null;
                // activeNode is kept to highlight the node currently processing if it hasn't resolved an SCC
            }
        }

        if (typeof resultLog !== 'undefined') {
            resultLog.innerHTML = logHTML;
            resultLog.scrollTop = resultLog.scrollHeight; 
        }

        // Apply Node Colors
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isResolved = d.id in resolvedSCCs;
            const isOnStack = currentStack.has(d.id);
            const isActive = activeNode === d.id;

            let targetColor = nodeColor;

            if (isResolved) {
                // Node belongs to a completed SCC
                targetColor = resolvedSCCs[d.id];
            } else if (isOnStack) {
                // Node is on the recursion stack (visiting phase)
                targetColor = '#ff8a65'; // Distinct green for stack memory
            }

            if (animate) {
                const trans = el.transition().duration(300).attr('fill', targetColor);
            } else {
                el.interrupt().attr('fill', targetColor);
            }
        });

        // Apply Edge Colors
        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const edgeKey = `${sId}-${tId}`;
            
            const isEval = evaluatingEdge === edgeKey;
            
            let targetColor = edgeColor;

            if (isEval) {
                targetColor = edgeEvalColor; 
            } else if (sId in resolvedSCCs && tId in resolvedSCCs && resolvedSCCs[sId] === resolvedSCCs[tId]) {
                // Both nodes in the same SCC: color the internal edge to match
                targetColor = resolvedSCCs[sId];
            } else if (sId in resolvedSCCs || tId in resolvedSCCs) {
                // Cross-edges between different SCCs or between resolved/unresolved fade out slightly
                targetColor = 'rgba(255,255,255,0.2)';
            }

            if (animate) {
                el.transition().duration(200).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }

            // Update associated arrow head
            if (directed) {
                const uniqueMarkerId = `${arrowId}-${sId}-${tId}`;
                const markerPath = svg.select(`#${uniqueMarkerId} path`);
                if (!markerPath.empty()) {
                    if (animate) {
                        markerPath.transition().duration(200).attr('fill', targetColor);
                    } else {
                        markerPath.interrupt().attr('fill', targetColor);
                    }
                }
            }
        });
    };
    
    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }
        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const playback = new GraphPlaybackController(svg, totalSteps, container, {
        onPlay: startLoop,
        onPause: stopLoop,
        onSeek: (step) => {
            currentStep = step;
            renderGraphState(currentStep, false);
        },
        onSpeedChange: () => {
            if (playInterval) { stopLoop(); startLoop(); }
        },
        onEnd: () => {
            stopLoop(); renderGraphState(0, false);
        }
    });
    
    startLoop();
    renderGraphState(0, false);
}

function visualizeBCC(graphName, container, nodes, edges, svg, arrowId) {
    if (algoGraphs.has(container)) {
        return;
    } else {
        algoGraphs.add(container);
    }
    
    // Block user interactions with the graph during visualization
    svg.select('#interaction-blocker').remove();
    svg.append('style')
        .attr('id', 'interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    const nodeIds = nodes.map(n => n.id !== undefined ? n.id : n);
    
    // Build undirected adjacency list
    const adj = {};
    nodeIds.forEach(id => adj[id] = []);
    edges.forEach(edge => {
        const u = edge.source.id !== undefined ? edge.source.id : edge.source;
        const v = edge.target.id !== undefined ? edge.target.id : edge.target;
        adj[u].push(v);
        adj[v].push(u);
    });

    // Hopcroft-Tarjan Algorithm State
    let idCounter = 0;
    const ids = {};
    const low = {};
    const stack = []; 
    nodeIds.forEach(id => ids[id] = -1);

    const animationSteps = [];
    let bccCount = 0;

    function dfs(u, p = null) {
        idCounter++;
        ids[u] = low[u] = idCounter;
        let children = 0;
        
        if (p === null) {
            animationSteps.push({ type: 'root_found', u: u });
        }
        
        animationSteps.push({ type: 'visit', u: u, id: ids[u], low: low[u] });

        for (const v of adj[u]) {
            if (v === p) continue; 

            if (ids[v] === -1) {
                children++;
                stack.push({ u, v });
                animationSteps.push({ type: 'eval_edge', u: u, v: v, edgeType: 'tree' });
                
                dfs(v, u);
                
                low[u] = Math.min(low[u], low[v]);
                animationSteps.push({ type: 'update_low', u: u, v: v, newLow: low[u] });

                // Articulation Point / BCC check
                if (low[v] >= ids[u]) {
                    // If it's not the root, it's definitively an AP.
                    if (p !== null) {
                        animationSteps.push({ type: 'ap_found', u: u });
                    }

                    const bccEdges = [];
                    let poppedEdge;
                    do {
                        poppedEdge = stack.pop();
                        bccEdges.push(poppedEdge);
                    } while (!(poppedEdge.u === u && poppedEdge.v === v));
                    
                    animationSteps.push({ 
                        type: 'bcc_found', 
                        u: u, 
                        edges: bccEdges, 
                        bccIndex: bccCount 
                    });
                    bccCount++;
                }
            } else if (ids[v] < ids[u]) {
                stack.push({ u, v });
                low[u] = Math.min(low[u], ids[v]);
                animationSteps.push({ type: 'eval_edge', u: u, v: v, edgeType: 'back', newLow: low[u] });
            }
        }

        // Special case: DFS Root is an AP only if it has > 1 independent children in the DFS tree
        if (p === null && children > 1) {
            animationSteps.push({ type: 'ap_found', u: u, isRootAP: true });
        }
    }

    // Run on all unvisited nodes (handles disconnected graphs)
    for (const node of nodeIds) {
        if (ids[node] === -1) dfs(node);
    }

    // Playback State Variables
    const totalSteps = animationSteps.length;
    const BASE_DELAY = 600; 
    let currentStep = 0;
    let playInterval = null;

    // Core Render Function
    const renderGraphState = (targetStep, animate = false) => {
        let visitedNodes = new Set();
        let dfsRoots = new Set();
        let articulationPoints = new Set();
        let resolvedBCCEdges = {}; 
        let evaluatingEdge = null;
        let activeNode = null;
        
        let logHTML = `
            <h3 style="color: #ff8a65;">Biconnected Components on <span style="color: #ff5722;">${graphName}</span></h3>
            <div style="font-size: 0.9em; margin-bottom: 10px; display: flex; gap: 15px;">
                <span><span style="color: #9b59b6;">●</span> DFS Root</span>
                <span><span style="color: #e67e22;">●</span> Articulation Point</span>
                <span><span style="color: ${nodeVisitColor};">●</span> Visited</span>
            </div>
            <div style="width: 100%; height: 1px; background-color: #333; margin: 0 0 20px 0;"></div>
        `;

        for (let idx = 0; idx < targetStep; idx++) {
            const step = animationSteps[idx];
            
            if (step.type === 'root_found') {
                logHTML += `<div style="color: #9b59b6; font-weight: bold;">Starting new DFS component. Root: ${step.u}</div>`;
                dfsRoots.add(step.u);
            } else if (step.type === 'visit') {
                logHTML += `<div>Discovered node <span style="color: #ff8a65">${step.u}</span> [id: ${step.id}].</div>`;
                visitedNodes.add(step.u);
                activeNode = step.u;
            } else if (step.type === 'eval_edge') {
                const eType = step.edgeType === 'tree' ? 'Tree-edge' : 'Back-edge';
                logHTML += `<div style="padding-left: 10px;">Evaluating ${eType}: <span style="color: #a3bf60">${step.u} - ${step.v}</span></div>`;
                evaluatingEdge = `${step.u}-${step.v}`;
                activeNode = step.u;
                if (step.edgeType === 'back') {
                    logHTML += `<div style="padding-left: 20px; color: #ff5722;">↳ Updated ${step.u}'s low-link to ${step.newLow}.</div><br>`;
                }
            } else if (step.type === 'update_low') {
                logHTML += `<div style="padding-left: 10px; color: #ff5722;">↳ Returned from ${step.v}. Updated ${step.u}'s low-link to ${step.newLow}.</div><br>`;
                activeNode = step.u;
            } else if (step.type === 'ap_found') {
                const reason = step.isRootAP ? "Root with >1 children" : `low[v] >= ids[${step.u}]`;
                logHTML += `<div style="color: #e67e22; font-weight: bold; margin-top: 5px;">Articulation Point Confirmed: ${step.u} (${reason})</div>`;
                articulationPoints.add(step.u);
            } else if (step.type === 'bcc_found') {
                const color = disColors[step.bccIndex % disColors.length];
                const edgeStrs = step.edges.map(e => `(${e.u}-${e.v})`);
                logHTML += `<div style="margin-top: 10px; padding: 5px; background: rgba(0,0,0,0.2); border-left: 3px solid ${color};">
                    <strong>BCC Found!</strong> Triggered at ${step.u}.<br>Edges: <span style="color: #a3bf60">${edgeStrs.join(', ')}</span>
                </div><br>`;
                
                step.edges.forEach(e => {
                    resolvedBCCEdges[`${e.u}-${e.v}`] = color;
                    resolvedBCCEdges[`${e.v}-${e.u}`] = color;
                });
                activeNode = null;
            }

            if (idx !== targetStep - 1) {
                evaluatingEdge = null;
            }
        }

        if (typeof resultLog !== 'undefined') {
            resultLog.innerHTML = logHTML;
            resultLog.scrollTop = resultLog.scrollHeight; 
        }

        // Apply Node Colors
        svg.selectAll('circle').each(function (d) {
            const el = d3.select(this);
            const isVisited = visitedNodes.has(d.id);
            const isRoot = dfsRoots.has(d.id);
            const isAP = articulationPoints.has(d.id);
            const isActive = activeNode === d.id;

            // Determine base fill color
            let targetColor = isVisited ? nodeVisitColor : nodeColor;
            if (isRoot) targetColor = '#cb75ee'; // Purple for roots
            else if (isAP) targetColor = '#ffa454'; // Orange for Articulation points

            // Determine stroke (border)
            let targetStroke = null;

            if (isActive) {
                targetStroke = edgeEvalColor; // Active yellow halo takes precedence
            } else if (isRoot && isAP) {
                // If a root is ALSO an AP, outline it heavily in orange so both identities are visible
                targetStroke = '#ffa454';
            }

            if (animate) {
                const trans = el.transition().duration(300).attr('fill', targetColor);
                if (targetStroke) trans.attr('stroke', targetStroke);
                else trans.attr('stroke', nodeBorderColor);
            } else {
                el.interrupt().attr('fill', targetColor);
                if (targetStroke) el.attr('stroke', targetStroke);
                else el.attr('stroke', nodeBorderColor);
            }
        });

        // Apply Edge Colors
        svg.selectAll('.link').each(function () {
            const el = d3.select(this);
            const sId = el.attr('source-id').replace(arrowId, '');
            const tId = el.attr('target-id').replace(arrowId, '');
            const edgeKey1 = `${sId}-${tId}`;
            const edgeKey2 = `${tId}-${sId}`;
            
            const isEval = evaluatingEdge === edgeKey1 || evaluatingEdge === edgeKey2;
            const bccColor = resolvedBCCEdges[edgeKey1] || resolvedBCCEdges[edgeKey2];
            
            let targetColor = edgeColor;

            if (bccColor) {
                targetColor = bccColor;
            } else if (isEval) {
                targetColor = edgeEvalColor; 
            }

            if (animate) {
                el.transition().duration(200).attr('stroke', targetColor);
            } else {
                el.interrupt().attr('stroke', targetColor);
            }
        });
    };
    
    const startLoop = () => {
        if (currentStep >= totalSteps) {
            currentStep = 0;
            playback.updateTimeline(0);
        }
        if (currentStep === 0) renderGraphState(0, false);

        playInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                currentStep++;
                playback.updateTimeline(currentStep);
                renderGraphState(currentStep, true);
            } else {
                stopLoop();
                playback.togglePlayState(false);
            }
        }, BASE_DELAY / playback.speed);
    };

    const stopLoop = () => {
        if (playInterval) {
            clearInterval(playInterval);
            playInterval = null;
        }
    };

    const playback = new GraphPlaybackController(svg, totalSteps, container, {
        onPlay: startLoop,
        onPause: stopLoop,
        onSeek: (step) => {
            currentStep = step;
            renderGraphState(currentStep, false);
        },
        onSpeedChange: () => {
            if (playInterval) { stopLoop(); startLoop(); }
        },
        onEnd: () => {
            stopLoop(); renderGraphState(0, false);
        }
    });
    
    startLoop();
    renderGraphState(0, false);
}