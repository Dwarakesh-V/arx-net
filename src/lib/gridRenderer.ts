import * as d3 from 'd3';
import { GRID_SIZE } from './constants'; // Ensure you added GRID_SIZE = 40 here

export const drawGrid = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    gridGroup: d3.Selection<SVGGElement, unknown, null, undefined>
) => {
    // 1. Get current viewbox
    const viewBoxAttr = svg.attr('viewBox');
    if (!viewBoxAttr) return;

    const viewBox = viewBoxAttr.split(' ').map(Number);
    const [minX, minY, width, height] = viewBox;

    // 2. Calculate boundaries
    const startX = Math.floor(minX / GRID_SIZE) * GRID_SIZE;
    const startY = Math.floor(minY / GRID_SIZE) * GRID_SIZE;
    const endX = minX + width;
    const endY = minY + height;

    // Buffer to prevent flickering at edges during pan
    const buffer = Math.max(width, height);

    // 3. Clear old lines (Heavy operation!)
    gridGroup.selectAll('*').remove();

    // 4. Draw Vertical Lines
    for (let x = startX - buffer; x < endX + buffer; x += GRID_SIZE) {
        gridGroup.append('line')
            .attr('x1', x)
            .attr('y1', minY - buffer)
            .attr('x2', x)
            .attr('y2', endY + buffer)
            .attr('stroke', 'var(--grid-line-color)') // Use CSS variable
            .attr('stroke-width', 1);
    }

    // 5. Draw Horizontal Lines
    for (let y = startY - buffer; y < endY + buffer; y += GRID_SIZE) {
        gridGroup.append('line')
            .attr('x1', minX - buffer)
            .attr('y1', y)
            .attr('x2', endX + buffer)
            .attr('y2', y)
            .attr('stroke', 'var(--grid-line-color)')
            .attr('stroke-width', 1);
    }
};