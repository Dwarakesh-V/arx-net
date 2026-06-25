// Focus on this container 
function focusOnThisContainer(container) {
    document.querySelectorAll('.graphContainer').forEach(c => {
        c.style.zIndex = 1;
        c.style.boxShadow = 'none';
    });
    container.style.zIndex = 2;
    container.style.boxShadow = '0px 0px 16px rgba(0, 0, 0, 0.5)';
}

// Focus on this container and center it in the viewport
function focusAndCenterContainer(container, resize = true) {

    container.style.height = '80%';
    container.style.width = '50%';
    isFullScreen = false; // Reset full screen state

    const offsetX = container.offsetWidth / 2;
    const offsetY = container.offsetHeight / 2;

    container.style.left = '25%';
    container.style.top = '10%';

    focusOnThisContainer(container);
}

// Dragging functionality for the container
function setContainerPosition(e, container) {
    if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'select' || e.target.closest('button')) return;
    e.preventDefault();

    let offsetX = e.clientX - container.offsetLeft;
    let offsetY = e.clientY - container.offsetTop;

    function relocateContainer(event) {
        let x = event.clientX - offsetX;
        let y = event.clientY - offsetY;
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
    }

    document.addEventListener('mousemove', relocateContainer);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', relocateContainer);
    }, { once: true });
}

function handleResizeStart(event, handle, container) {
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startWidth = container.offsetWidth;
    const startHeight = container.offsetHeight;
    const startLeft = container.offsetLeft;
    const startTop = container.offsetTop;
    const corner = handle.getAttribute('data-corner');

    function onResizeMouseMove(e) {
        performResize(e, {
            startX, startY, startWidth, startHeight, startLeft, startTop, corner, container
        });
    }

    document.addEventListener('mousemove', onResizeMouseMove);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', onResizeMouseMove);
    }, { once: true });
}

/* Window resize functionality */
function performResize(event, { startX, startY, startWidth, startHeight, startLeft, startTop, corner, container }) {
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    if (corner.includes('right')) {
        newWidth = startWidth + (event.clientX - startX);
    }
    if (corner.includes('left')) {
        newWidth = startWidth - (event.clientX - startX);
        newLeft = startLeft + (event.clientX - startX);
    }
    if (corner.includes('bottom')) {
        newHeight = startHeight + (event.clientY - startY);
    }
    if (corner.includes('top')) {
        newHeight = startHeight - (event.clientY - startY);
        newTop = startTop + (event.clientY - startY);
    }

    const minWidth = window.innerWidth * 0.33;
    const minHeight = window.innerHeight * 0.5;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    if (newWidth > minWidth && newWidth < maxWidth) {
        container.style.width = newWidth + 'px';
        container.style.left = newLeft + 'px';
    }
    if (newHeight > minHeight && newHeight < maxHeight) {
        container.style.height = newHeight + 'px';
        container.style.top = newTop + 'px';
    }
}
/* End of window resize functionality */

function handleTopResizeMouseDown(event, methodsElement, container, svgElement) {
    event.preventDefault();

    const startY = event.clientY;
    const startHeight = methodsElement.offsetHeight;

    function onTopResizeMouseMove(e) {
        performTopResize(e, startY, startHeight, methodsElement, container, svgElement);
    }

    function onTopResizeMouseUp() {
        document.removeEventListener('mousemove', onTopResizeMouseMove);
    }

    document.addEventListener('mousemove', onTopResizeMouseMove);
    document.addEventListener('mouseup', onTopResizeMouseUp, { once: true });
}

function performTopResize(event, startY, startHeight, methodsElement, container, svgElement) {
    const newHeight = startHeight - (event.clientY - startY);
    const minHeight = container.offsetHeight * 0.2;
    const maxHeight = container.offsetHeight * 0.9;

    if (newHeight >= minHeight && newHeight <= maxHeight) {
        methodsElement.style.height = `${newHeight}px`;
        svgElement.style.height = `calc(100% - ${newHeight}px)`;
    }
}
