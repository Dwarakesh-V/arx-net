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
    } else {
        this.getElementsByTagName('img')[0].src = 'images/sidebaropen.png';
        graphGenMenu.style.display = 'none';
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

    const clone = svgElement.cloneNode(true);
    clone.setAttribute('width', width);
    clone.setAttribute('height', height);
    if (!clone.getAttribute('viewBox')) {
        clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    // Resolve every custom property NOW while we still have the live,
    // styled document to read computed values from. Inside the detached
    // clone these vars would fail to resolve entirely.
    const rootStyles = getComputedStyle(document.documentElement);
    const nodeLabelColor = rootStyles.getPropertyValue('--node-label-color').trim() || '#000';
    const edgeWeightColor = rootStyles.getPropertyValue('--edge-weight-color').trim() || '#fff';
    const edgeColor = rootStyles.getPropertyValue('--edge-color').trim() || '#999';
    const nodeColor = rootStyles.getPropertyValue('--node-color').trim() || '#42baff';

    const style = document.createElement('style');
    style.textContent = `
        * {
            box-sizing: border-box;
            font-family: "Google Sans Flex", sans-serif;
        }
        .node {
            r: 30;
            stroke-width: 5;
            fill: ${nodeColor};
        }
        .node-label {
            font-size: 24px;
            font-weight: bold;
            fill: ${nodeLabelColor};
            pointer-events: none;
        }
        .edge-label {
            font-size: 24px;
            font-family: 'Comic Relief', sans-serif;
            font-weight: bold;
            stroke: #141414;
            stroke-width: 4;
            paint-order: stroke;
            pointer-events: none;
            fill: ${edgeWeightColor};
        }
        .directed-arrow {
            fill: ${edgeColor};
        }
    `;
    clone.prepend(style);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.width = width;
    img.height = height;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = isTransparent ? 'transparent' : '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(scale, scale);
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
    if (type == 'Tree') {
        treeTypeSelect.style.display = 'flex';
        graphOptions.style.display = 'none';
        minMaxRec.style.display = 'none';
        edgeInput.style.display = 'none';
        edgeLabel.style.display = 'none';

        // Handle text in buttons
        generateRandomButton.innerText = "Generate random tree";
        generateSimpleButton.innerText = "Generate simple random tree";
        generateComplexButton.innerText = "Generate complex random tree";
        generateButton.innerText = "Generate tree";
    } else {
        treeTypeSelect.style.display = 'none';
        graphOptions.style.display = 'flex';
        minMaxRec.style.display = 'block';
        edgeInput.style.display = 'flex';
        edgeLabel.style.display = 'flex';

        // Handle text in buttons
        generateRandomButton.innerText = "Generate random graph";
        generateSimpleButton.innerText = "Generate simple random graph";
        generateComplexButton.innerText = "Generate complex random graph";
        generateButton.innerText = "Generate graph";
    }
}

customizeButton.addEventListener('click', () => {
    customizeRandom.style.display = 'block';

    function closeMenu(e) {
        if (
            customizeButton.contains(e.target) ||
            customizeRandom.contains(e.target) ||
            e.target == isDirected ||
            e.target == isWeighted ||
            e.target == isTypeGraph ||
            e.target == isTypeTree
        ) {
            return;
        }
        customizeRandom.style.display = 'none';
        document.removeEventListener('click', closeMenu);
    }
    document.addEventListener('click', closeMenu);
});

/* Light and dark mode toggle */
let mode = "dark";
toggleModeButton.addEventListener("click", () => {
    mode = mode === "dark" ? "light" : "dark";

    document.documentElement.classList.toggle("light-mode");
    nodeHoverColor = getComputedStyle(document.documentElement).getPropertyValue('--node-hover-color').trim();
    dragNodeColor = getComputedStyle(document.documentElement).getPropertyValue('--drag-node-color').trim();

    const buttonImage = toggleModeButton.querySelector("img");
    buttonImage.src = mode === "light" ? "images/dark.png" : "images/light.png";
});
/* End of light and dark mode toggle */

/* Downloading and uploading functionality */
downloadButton.addEventListener('click', () => {
    const jsonData = Object.fromEntries(graphMap);

    const blob = new Blob(
        [JSON.stringify(jsonData, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "graphs.json";
    a.click();

    URL.revokeObjectURL(url);
});

uploadButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        try {
            const data = JSON.parse(await file.text());

            if (typeof data !== "object" || data === null || Array.isArray(data)) {
                alert("Invalid JSON format.");
                return;
            }

            for (const [key, arr] of Object.entries(data)) {
                if (
                    !Array.isArray(arr) ||
                    arr.length !== 3 ||
                    typeof arr[0] !== "string" ||
                    typeof arr[1] !== "boolean" ||
                    typeof arr[2] !== "boolean"
                ) {
                    console.error(`Skipping invalid entry "${key}"`, arr);
                    continue;
                }

                addGraph(
                    arr[0], // edges
                    null,
                    key,
                    arr[1], // directed
                    arr[2]  // weighted
                );
            }
        } catch (err) {
            alert("Invalid JSON file.");
            console.error(err);
        }
    };

    input.click();
});

/* End of uploading and downloading functionality */


/* Result log resize for better visibility */
const resultLogResizeBuffer = 8;
let resultLogResizing = false;

resultLog.addEventListener("mousedown", (e) => {
    const rect = resultLog.getBoundingClientRect();
    if (e.clientX - rect.left <= resultLogResizeBuffer) {
        resultLogResizing = true;
        e.preventDefault();
    }
});

document.addEventListener("mousemove", (e) => {
    if (!resultLogResizing) return;
    const minWidth = window.innerWidth * 0.25;
    const maxWidth = window.innerWidth * 0.75;
    let newWidth = window.innerWidth - e.clientX;
    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
    resultLog.style.width = `${Math.max(250, newWidth)}px`;
});

document.addEventListener("mouseup", () => {
    resultLogResizing = false;
});

function showColorPicker(x, y, initialColor, callback) {
    const popup = document.createElement("div");
    popup.className = "color-picker-popup";

    const input = document.createElement("input");
    input.type = "color";
    input.value = initialColor;

    const ok = document.createElement("button");
    ok.textContent = "Select";

    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";

    popup.append(input, document.createElement("br"), ok, cancel);
    document.body.appendChild(popup);

    // Keep within viewport
    const rect = popup.getBoundingClientRect();
    if (x + rect.width > window.innerWidth)
        x = window.innerWidth - rect.width - 8;
    if (y + rect.height > window.innerHeight)
        y = window.innerHeight - rect.height - 8;

    popup.style.left = `${Math.max(8, x)}px`;
    popup.style.top = `${Math.max(8, y)}px`;

    function close() {
        document.removeEventListener("mousedown", outsideClick);
        popup.remove();
    }

    function outsideClick(e) {
        if (!popup.contains(e.target)) {
            close();
        }
    }

    // Delay attaching so the click that opened the popup doesn't immediately close it.
    setTimeout(() => {
        document.addEventListener("mousedown", outsideClick);
    }, 0);

    ok.onclick = () => {
        callback(input.value);
        close();
    };

    cancel.onclick = close;
}