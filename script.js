document.addEventListener('DOMContentLoaded', () => {
    let isDragging = false;
    let activeContainer = null;
    let offsetX, offsetY;

    // Appliquer les gestionnaires d'événements à tous les conteneurs
    document.querySelectorAll('.container').forEach(container => {
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
                    if (activeContainer.id === 'privateKey' && container.id === 'document') {
                        container.style.backgroundColor = 'red'; // Change la couleur en rouge
                    }
                    if (activeContainer.id === 'publicKey' && container.id === 'document') {
                        container.style.backgroundColor = 'greenyellow'; // Change la couleur en rouge
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
});

