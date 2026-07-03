function visualizeBFS(startNodeId, nodes, edges, svg, arrowId, directed, container) {
    // Block user interactions with the graph during visualization
    svg.select('#bfs-interaction-blocker').remove(); // Clear any old ones
    svg.append('style')
        .attr('id', 'bfs-interaction-blocker')
        .text('circle, .link, .link2 { pointer-events: none !important; }');

    // Calculate BFS path
    const queue = [startNodeId];
    const visited = new Set();
    visited.add(startNodeId);

    const animationSteps = [];
    animationSteps.push({ type: 'node', id: startNodeId });

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
                animationSteps.push({ type: 'edge', sourceId: sId, targetId: tId });
                animationSteps.push({ type: 'node', id: nextNodeId });
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

        for (let i = 0; i < targetStep; i++) {
            const step = animationSteps[i];
            if (step.type === 'node') activeNodes.add(step.id);
            if (step.type === 'edge') activeEdges.add(`${step.sourceId}-${step.targetId}`);
        }

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
                // If we reach the end, stop the loop and flip the toggle UI back to 'Play'
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