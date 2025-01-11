document.addEventListener('DOMContentLoaded', () => {
    let isDragging = false;
    let activeContainer = null;
    let offsetX, offsetY;
    let lock = false;
    let privateLock = false;
    let publicLock = false;

    const initialPositions = {}; // Store initial positions of containers

    // Apply event handlers to all containers
    document.querySelectorAll('.container').forEach(container => {
        // Position containers randomly on page load
        const randomLeft = Math.floor(Math.random() * (window.innerWidth - container.offsetWidth));
        const randomTop = Math.floor(Math.random() * (window.innerHeight - 100 - container.offsetHeight)); // Subtract 100px for bottom limit

        container.style.position = 'absolute';
        container.style.left = `${randomLeft}px`;
        container.style.top = `${randomTop}px`;

        // Record the initial position
        initialPositions[container.id] = {
            left: randomLeft,
            top: randomTop
        };

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            activeContainer = container;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            container.style.position = 'absolute'; // Enable dragging
            container.style.zIndex = 1000; // Bring to front during drag
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && activeContainer) {
            // Update position
            activeContainer.style.left = `${e.clientX - offsetX}px`;
            activeContainer.style.top = `${e.clientY - offsetY}px`;

            // Constrain container within the viewport
            keepWithinBounds(activeContainer);

            // Check for collisions with other containers
            document.querySelectorAll('.container').forEach(container => {
                if (container !== activeContainer && isColliding(activeContainer, container)) {
                    // Handle collisions
                    if (activeContainer.id === 'privateKey' && container.id === 'document' && !lock && !publicLock && !privateLock) {
                        document.getElementById('documentImage').src = 'media/cipheredDocument.png';
                        lock = true;
                        privateLock = true;
                        console.log("private key locking");
                        resetPosition(activeContainer);
                        document.querySelector('#document h3').innerText = "Ciphered";
                    } else if (activeContainer.id === 'publicKey' && container.id === 'document' && lock && !publicLock && privateLock) {
                        document.getElementById('documentImage').src = 'media/document.png';
                        lock = false;
                        privateLock = false;
                        console.log("public key unlocking");
                        resetPosition(activeContainer);
                        document.querySelector('#document h3').innerText = "document";
                    } else if (activeContainer.id === 'publicKey' && container.id === 'document' && !lock && !publicLock && !privateLock) {
                        document.getElementById('documentImage').src = 'media/cipheredDocument.png';
                        lock = true;
                        publicLock = true;
                        console.log("public key locking");
                        resetPosition(activeContainer);
                        document.querySelector('#document h3').innerText = "Ciphered";
                    } else if (activeContainer.id === 'privateKey' && container.id === 'document' && lock && publicLock && !privateLock) {
                        document.getElementById('documentImage').src = 'media/document.png';
                        lock = false;
                        publicLock = false;
                        console.log("private key unlocking");
                        resetPosition(activeContainer);
                        document.querySelector('#document h3').innerText = "document";
                    }
                }
            });
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (activeContainer) {
            activeContainer.style.zIndex = ''; // Reset z-index
            activeContainer = null;
        }
    });

    // Function to check if two elements are colliding
    function isColliding(rect1, rect2) {
        const r1 = rect1.getBoundingClientRect();
        const r2 = rect2.getBoundingClientRect();

        return !(
            r1.right < r2.left ||
            r1.left > r2.right ||
            r1.bottom < r2.top ||
            r1.top > r2.bottom
        );
    }

    // Function to reset a container's position
    function resetPosition(container) {
        const initial = initialPositions[container.id];
        if (initial) {
            container.style.left = `${initial.left}px`;
            container.style.top = `${initial.top}px`;
            activeContainer = null;
        }
    }

    // Function to keep a container within viewport bounds
    function keepWithinBounds(container) {
        const rect = container.getBoundingClientRect();
        const { innerWidth: vw, innerHeight: vh } = window;

        // Ensure the container stays within the viewport bounds
        if (rect.left < 0) {
            container.style.left = '0px';
        }
        if (rect.top < 0) {
            container.style.top = '0px';
        }
        if (rect.right > vw) {
            container.style.left = `${vw - rect.width}px`;
        }
        if (rect.bottom > vh - 100) { // Subtract 100px for the bottom limit
            container.style.top = `${vh - 100 - rect.height}px`;
        }
    }
});

