import * as d3 from 'd3';
import type { Node, Edge } from '../types';
import { smoothFunction } from './graphUtils';

// --- 1. Simulation Setup ---

export const createSimulation = (nodes: Node[], width: number, height: number) => {
  return d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX(width / 2).strength(0.05))
    .force('y', d3.forceY(height / 2).strength(0.05))
    .force('collide', d3.forceCollide().radius(30).iterations(2))
    .stop();
};

export const updateForces = (
  simulation: d3.Simulation<Node, undefined>,
  edges: Edge[],
  useForce: boolean,
  width: number,
  height: number
) => {
  const safeWidth = width || 500;
  const safeHeight = height || 500;
  const centerX = safeWidth / 2;
  const centerY = safeHeight / 2;

  // Update Center and Gravity targets
  simulation.force('center', d3.forceCenter(centerX, centerY));
  simulation.force('x', d3.forceX(centerX).strength(0.05));
  simulation.force('y', d3.forceY(centerY).strength(0.05));

  const linkForce = d3.forceLink(edges).id((d: any) => d.id).distance(150);

  if (useForce) {
    simulation.force('link', linkForce);
    simulation.force('charge', d3.forceManyBody().strength(-500));
    simulation.force('collide', d3.forceCollide().radius(30));
    simulation.alpha(1).restart();
  } else {
    // Physics OFF Mode
    simulation.force('link', linkForce);
    simulation.force('charge', d3.forceManyBody().strength(-500));
    simulation.force('collide', d3.forceCollide().radius(30));

    // Warmup ticks to stabilize layout
    simulation.tick(300);

    // Stop movement
    simulation.force('charge', null);
    simulation.force('link', null);
    simulation.force('center', null);
    simulation.force('collide', null);
    simulation.force('x', null); // Stop gravity too
    simulation.force('y', null);

    simulation.stop();
  }
};

// --- 2. Positioning & Drawing (No changes needed here) ---
export const setEdgePositions = (
  linkSelection: d3.Selection<any, any, any, any>,
  edgeLabelSelection: d3.Selection<any, any, any, any>,
  nodeSelection: d3.Selection<any, any, any, any>,
  labelSelection: d3.Selection<any, any, any, any>,
  directed: boolean,
  weighted: boolean
) => {
  linkSelection.attr('d', (d: any) => {
    if (d.selfLoop) {
      const { x, y } = d.source;
      const r = 30;
      return `M${x},${y - 25 - r} a${r},${r} 0 1,1 0,${2 * r} a${r},${r} 0 1,1 0,${-2 * r}`;
    }
    if (d.bidirectional) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;
      return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
    }
    return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
  });

  if (directed) {
    linkSelection.each(function (d: any) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const sId = typeof d.source === 'object' ? d.source.id : d.source;
      const tId = typeof d.target === 'object' ? d.target.id : d.target;
      const marker = d3.select(`#arrow-${sId}-${tId}`);

      if (!marker.empty()) {
        if (d.selfLoop) {
          marker.attr('orient', 0).attr('refX', 4).attr('refY', -0.5);
        } else if (d.bidirectional) {
          const angle = Math.atan2(dy, dx) + Math.PI / (smoothFunction(length));
          marker.attr('orient', angle * (180 / Math.PI));
        } else {
          marker.attr('orient', 'auto');
        }
      }
    });
  }

  if (weighted && edgeLabelSelection) {
    edgeLabelSelection
      .attr('x', (d: any) => {
        const midpointX = (d.source.x + d.target.x) / 2;
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        if (d.selfLoop) return midpointX - 5;
        if (d.bidirectional) return midpointX + Math.sin(angle) * length / 10;
        return midpointX;
      })
      .attr('y', (d: any) => {
        const midpointY = (d.source.y + d.target.y) / 2;
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        if (d.selfLoop) return midpointY - 27;
        if (d.bidirectional) return midpointY - Math.cos(angle) * length / 10;
        return midpointY;
      });
  }

  nodeSelection.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
  labelSelection.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
};

// --- 3. Drag Handlers ---

export const dragBehavior = (simulation: d3.Simulation<Node, undefined>, useForce: boolean) => {

  function dragstarted(this: SVGCircleElement, event: any, d: any) {
    // IMPORTANT FIX: 
    // Always restart the simulation on drag start, even if useForce is false.
    // Why? Because we need the 'tick' event to fire so the lines follow the node.
    // If useForce is false, forces are null (from updateForces), so nodes won't repel,
    // but the rendering loop will run.
    simulation.alphaTarget(0.3).restart();

    d.fx = d.x;
    d.fy = d.y;
    d3.select(this).attr('fill', 'var(--drag-node-color)');
  }

  function dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(this: SVGCircleElement, event: any, d: any) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    d3.select(this).attr('fill', 'var(--node-color)');
  }

  return d3.drag<SVGCircleElement, any>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};

export const updateGraphDimensions = (
  simulation: d3.Simulation<Node, undefined>,
  nodes: Node[],
  width: number,
  height: number,
  prevWidth: number,
  prevHeight: number,
  useForce: boolean
) => {
  const safeWidth = width || 500;
  const safeHeight = height || 500;
  const centerX = safeWidth / 2;
  const centerY = safeHeight / 2;

  // Always update force centers in case we toggle force back on
  simulation.force('center', d3.forceCenter(centerX, centerY));
  simulation.force('x', d3.forceX(centerX).strength(0.05));
  simulation.force('y', d3.forceY(centerY).strength(0.05));

  if (useForce) {
    simulation.alpha(0.3).restart();
  } else {
    // Manually shift nodes to keep relative center
    const dx = (width - prevWidth) / 2;
    const dy = (height - prevHeight) / 2;
    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      nodes.forEach(node => {
        if (node.x !== undefined) node.x += dx;
        if (node.y !== undefined) node.y += dy;
        // Fix position if it was fixed (dragging)
        if (node.fx !== undefined && node.fx !== null) node.fx += dx;
        if (node.fy !== undefined && node.fy !== null) node.fy += dy;
      });
      // Trigger render update immediately without running physics simulation
      const tickListener = simulation.on('tick');
      // @ts-ignore
      if (typeof tickListener === 'function') {
        tickListener.call(simulation);
      }
    }
  }
};