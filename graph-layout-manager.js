/* Add graph on enter key press */
document.getElementById('edges').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addGraph();
    }
});

// Show/Hide All functionality
showHideAll.addEventListener('click', () => {
    const allGraphs = document.getElementsByClassName('showHideCurrentGraph');
    if (showHideAllGraphs) {
        Array.from(allGraphs).forEach(itemGraph => {
            const img = itemGraph.getElementsByTagName('img')[0];
            if (img && img.src.endsWith('show.png')) {
                itemGraph.click();
            }
        })
        showHideAllGraphs = false;
        showHideAll.getElementsByTagName('img')[0].src = 'images/hide.png';
    } else {
        Array.from(allGraphs).forEach(itemGraph => {
            const img = itemGraph.getElementsByTagName('img')[0];
            if (img && img.src.endsWith('hide.png')) {
                itemGraph.click();
            }
        })
        showHideAllGraphs = true;
        showHideAll.getElementsByTagName('img')[0].src = 'images/show.png';
    }
});

// Clear All functionality
clearAll.addEventListener('click', () => {
    if (confirm('Are you sure want to delete all graphs? This action cannot be undone.')) {
        const allGraphs = document.getElementsByClassName('deleteCurrentGraph')
        Array.from(allGraphs).forEach(itemGraph => {
            itemGraph.click();
        });
    }
});
