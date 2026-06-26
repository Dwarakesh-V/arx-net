function handleOutsideClickAbout(event) {
    if (!aboutDiv.contains(event.target) && event.target !== aboutBtn) {
        aboutDiv.style.display = 'none';
        document.removeEventListener('click', handleOutsideClickAbout);
    }
}

aboutBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    const isVisible = aboutDiv.style.display === 'block';

    if (isVisible) {
        aboutDiv.style.display = 'none';
        document.removeEventListener('click', handleOutsideClickAbout);
    } else {
        aboutDiv.style.display = 'block';
        document.addEventListener('click', handleOutsideClickAbout);
    }
});

// Graph generation menu visibility toggle functionality
cgb.addEventListener('click', function () {
    if (this.getElementsByTagName('img')[0].src.endsWith('sidebaropen.png')) {
        this.getElementsByTagName('img')[0].src = 'images/sidebarclose.png';
        graphGenMenu.style.display = 'block';
        outliner.style.height = '25vh';
    } else {
        this.getElementsByTagName('img')[0].src = 'images/sidebaropen.png';
        graphGenMenu.style.display = 'none';
        outliner.style.height = '84vh';
    }
});

fullScreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
});

// Maximum edges calculation functionality
function updateMinMax() {
    const updatedValue = parseInt(document.getElementById("numNodes").value);
    const maxRecEl = document.getElementById("maxRec");

    if (!Number.isInteger(updatedValue)) {
        alert("Please enter a valid integer for the number of nodes.");
        document.getElementById("numNodes").value = "";
        return;
    }

    const n = updatedValue;

    if (duplicateEdges.checked) {
        // If duplicate edges are allowed, there's no upper bound
        maxRecEl.innerHTML = '∞';
    } else {
        let maxEdges;
        if (isDirected.checked) {
            if (selfLoops.checked) {
                maxEdges = n * n; // directed with self-loops
            } else {
                maxEdges = n * (n - 1); // directed without self-loops
            }
        } else {
            if (selfLoops.checked) {
                maxEdges = n * (n - 1) / 2 + n; // undirected with self-loops
            } else {
                maxEdges = n * (n - 1) / 2; // undirected without self-loops
            }
        }
        let minEdges = 0;
        if (connected.checked) {
            minEdges = n - 1
        }
        maxRecEl.innerHTML = `${maxEdges}/${minEdges}`;
    }
}

function dispMinMax() {
    document.getElementById('wtinp').style.display = document.getElementById('wtinp').style.display == 'none' ? 'flex' : 'none';
}

function saveSvgAsPng(svgElement, filename = 'image.png', isTransparent = false, scale = 4) {
    const rect = svgElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Clone so we don't mutate the live element
    const clone = svgElement.cloneNode(true);

    // ✅ Force the SVG's own dimensions to match its rendered size.
    // Without this, the browser picks intrinsic size from attributes/viewBox
    // when loading as <img>, causing a stretch mismatch with the canvas.
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);

    // Preserve the viewBox if present, so internal layout isn't distorted
    if (!clone.getAttribute('viewBox')) {
        clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    const computedColor = getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#000000';
    const style = document.createElement('style');
    style.textContent = `
        * {
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            text-decoration: none;
            outline: none;
            color: ${computedColor};
        }
    `;
    clone.prepend(style);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    //  Give the img element explicit dimensions too, so drawImage has an unambiguous source size to map from
    img.width = width;
    img.height = height;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        ctx.filter = 'grayscale(100%)';
        ctx.fillStyle = isTransparent ? 'transparent' : '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.scale(scale, scale);
        // Explicitly pass source dimensions
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    img.onerror = (err) => {
        console.error('Error loading SVG image:', err);
        URL.revokeObjectURL(url);
    };

    img.src = url;
}


function handleTypeChange(type) {
    if (type=='Tree') {
        treeTypeSelect.style.display = 'flex';
        graphOptions.style.display = 'none';
        minMaxRec.style.display = 'none';
        edgeInput.style.display = 'none';
        edgeLabel.style.display = 'none';
    } else {
        treeTypeSelect.style.display = 'none';
        graphOptions.style.display = 'flex';
        minMaxRec.style.display = 'block';
        edgeInput.style.display = 'flex';
        edgeLabel.style.display = 'flex';
    }
}
