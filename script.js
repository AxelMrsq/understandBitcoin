document.addEventListener('DOMContentLoaded', () => {
    let isDragging = false;
    let activeContainer = null;
    let offsetX, offsetY;
    let lock = false;
    let privateLock = false;
    let publicLock = false;

    const initialPositions = {}; // Stocker les positions initiales des conteneurs

    // Appliquer les gestionnaires d'événements à tous les conteneurs
    document.querySelectorAll('.container').forEach(container => {
        // Positionner aléatoirement les conteneurs au chargement de la page
        const randomLeft = Math.floor(Math.random() * (window.innerWidth - container.offsetWidth));
        const randomTop = Math.floor(Math.random() * (window.innerHeight - container.offsetHeight));

        container.style.position = 'absolute';
        container.style.left = `${randomLeft}px`;
        container.style.top = `${randomTop}px`;

        // Enregistrer la position initiale
        initialPositions[container.id] = {
            left: randomLeft,
            top: randomTop
        };

        container.addEventListener('mousedown', (e) => {
            isDragging = true;
            activeContainer = container;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            container.style.position = 'absolute'; // Permet le déplacement
            container.style.zIndex = 1000; // Met au premier plan pendant le déplacement
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging && activeContainer) {
            activeContainer.style.left = `${e.clientX - offsetX}px`;
            activeContainer.style.top = `${e.clientY - offsetY}px`;

            // Vérifier les collisions avec d'autres conteneurs
            document.querySelectorAll('.container').forEach(container => {
                if (container !== activeContainer && isColliding(activeContainer, container)) {
                    // Action si collision détectée
                    if (activeContainer.id === 'privateKey' && container.id === 'document' && lock == false && publicLock == false && privateLock == false) {
                        container.style.backgroundColor = 'red'; // Change la couleur en rouge
                        lock = true;
                        privateLock = true;
                        console.log("private key locking");
                        resetPosition(activeContainer);
                    }
                    else if (activeContainer.id === 'publicKey' && container.id === 'document' && lock == true && publicLock == false && privateLock == true ) {
                        container.style.backgroundColor = 'beige'; 
                        lock = false;
                        privateLock = false; 
                        console.log("public key unlocking");
                        resetPosition(activeContainer);
                    }
                    else if (activeContainer.id === 'publicKey' && container.id === 'document' && lock == false && publicLock == false && privateLock == false ) {
                        container.style.backgroundColor = 'greenyellow'; // Change la couleur en rouge
                        lock = true;
                        publicLock = true;
                        console.log("public key locking");
                        resetPosition(activeContainer);
                    }
                    else if (activeContainer.id === 'privateKey' && container.id === 'document' && lock == true && publicLock == true && privateLock == false) {
                        container.style.backgroundColor = 'beige'; // Change la couleur en rouge
                        lock = false;
                        publicLock = false;
                        console.log("private key unlocking");
                        resetPosition(activeContainer);
                    }
                } 
            });
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (activeContainer) {
            activeContainer.style.zIndex = ''; // Réinitialise la priorité d'affichage
            activeContainer = null;
        }
    });

    // Fonction pour vérifier si deux éléments se chevauchent
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

    // Fonction pour réinitialiser la position d'un conteneur
    function resetPosition(container) {
        const initial = initialPositions[container.id];
        if (initial) {
            container.style.left = `${initial.left}px`;
            container.style.top = `${initial.top}px`;
            activeContainer = null;
        }
    }
});

