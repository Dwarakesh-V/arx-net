import * as d3 from 'd3';
import type { Node, Edge } from '../types';
import { smoothFunction } from './graphUtils';

// --- 1. Simulation Setup ---

export const createSimulation = (nodes: Node[], width: number, height: number) => {
  return d3.forceSimulation(nodes)
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .stop(); 
};

export const updateForces = (
  simulation: d3.Simulation<Node, undefined>, 
  edges: Edge[], 
  useForce: boolean,
  width: number, 
  height: number
) => {
  if (useForce) {
    simulation.force('charge', d3.forceManyBody().strength(-300));
    simulation.force('link', d3.forceLink(edges).id((d: any) => d.id).distance(300));
    simulation.force('center', d3.forceCenter(width / 2, height / 2));
    simulation.alpha(1).restart();
  } else {
    simulation.force('charge', null);
    simulation.force('link', null);
    simulation.force('center', null);
    simulation.stop();
  }
};

// --- 2. Positioning & Drawing ---

export const setEdgePositions = (
  linkSelection: d3.Selection<any, any, any, any>,
  edgeLabelSelection: d3.Selection<any, any, any, any>,
  nodeSelection: d3.Selection<any, any, any, any>,
  labelSelection: d3.Selection<any, any, any, any>,
  directed: boolean,
  weighted: boolean
) => {
  
  // 1. Update Link Paths
  linkSelection.attr('d', (d: any) => {
    if (d.selfLoop) {
      const { x, y } = d.source;
      const r = 30; 
      // Draw visible self-loop as elliptical arc
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

  // 2. Rotate Arrows
  if (directed) {
    linkSelection.each(function(d: any) {
      const dx = d.target.x - d.source.x;
      const dy = d.target.y - d.source.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Select the specific marker for this edge
      // Note: In D3 v6+, we select by ID directly
      const sId = typeof d.source === 'object' ? d.source.id : d.source;
      const tId = typeof d.target === 'object' ? d.target.id : d.target;
      const uniqueId = `#arrow-${sId}-${tId}`;
      
      const marker = d3.select(uniqueId);
      
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

  // 3. Position Weights
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

  // 4. Position Nodes & Labels
  nodeSelection.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
  labelSelection.attr('x', (d: any) => d.x).attr('y', (d: any) => d.y);
};

// --- 3. Drag Handlers ---

export const dragBehavior = (simulation: d3.Simulation<Node, undefined>, useForce: boolean) => {
  
  // FIX: Explicitly type 'this' as SVGCircleElement to solve ts(2683)
  function dragstarted(this: SVGCircleElement, event: any, d: any) {
    if (!event.active && useForce) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
    d3.select(this).attr('fill', 'var(--drag-node-color)');
  }

  function dragged(event: any, d: any) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(this: SVGCircleElement, event: any, d: any) {
    if (!event.active && useForce) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
    d3.select(this).attr('fill', 'var(--node-color)');
  }

  return d3.drag<SVGCircleElement, any>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
};