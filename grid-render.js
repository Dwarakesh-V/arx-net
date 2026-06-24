/* Functions to draw grid */
// Function to draw infinite grid
function drawGrid(svg, grid) {
    const viewBox = svg.attr('viewBox').split(' ').map(Number);
    const [minX, minY, width, height] = viewBox;

    // Get the actual physical dimensions of the SVG on the screen
    const svgNode = svg.node();
    const rect = svgNode.getBoundingClientRect();

    // Calculate the scale factor the browser is currently applying 
    const scale = Math.min(rect.width / width, rect.height / height);

    // Calculate the TRUE visible width and height in SVG coordinate space
    const visibleWidth = rect.width / scale;
    const visibleHeight = rect.height / scale;

    const startX = Math.floor(minX / gridSize) * gridSize;
    const startY = Math.floor(minY / gridSize) * gridSize;
    const endX = minX + width;
    const endY = minY + height;

    // Use the true visible dimensions for your buffers
    const bufferX = visibleWidth;
    const bufferY = visibleHeight;

    grid.selectAll('*').remove();

    // Vertical lines
    for (let x = startX - bufferX; x < endX + bufferX; x += gridSize) {
        grid.append('line')
            .attr('x1', x).attr('y1', minY - bufferY)
            .attr('x2', x).attr('y2', endY + bufferY)
            .attr('stroke', gridLineColor).attr('stroke-width', 1);
    }

    // Horizontal lines
    for (let y = startY - bufferY; y < endY + bufferY; y += gridSize) {
        grid.append('line')
            .attr('x1', minX - bufferX).attr('y1', y)
            .attr('x2', endX + bufferX).attr('y2', y)
            .attr('stroke', gridLineColor).attr('stroke-width', 1);
    }
}
/* End of infinite grid */

// /* Function to draw finite grid */
// function drawGrid(width=1000, height=1000, svg) {
//     // Remove any existing grid lines
//     grid.selectAll('*').remove();

//     // Draw vertical grid lines
//     for (let x = 0; x <= width; x += gridSize) {
//         grid.append('line')
//             .attr('x1', x).attr('y1', 0)
//             .attr('x2', x).attr('y2', height)
//             .attr('stroke', '#cccccc77').attr('stroke-width', 1);
//     }

//     // Draw horizontal grid lines
//     for (let y = 0; y <= height; y += gridSize) {
//         grid.append('line')
//             .attr('x1', 0).attr('y1', y)
//             .attr('x2', width).attr('y2', y)
//             .attr('stroke', '#cccccc77').attr('stroke-width', 1);
//     }
// }
/* End of function to draw finite grid */
/* End of functions to draw grid */