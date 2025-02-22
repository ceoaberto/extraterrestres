let draggedElement = null;

document.querySelectorAll('.touch-draggable').forEach(image => {
    image.addEventListener('touchstart', (event) => {
        draggedElement = event.target.cloneNode(true);
        draggedElement.classList.add('alien-part');
        draggedElement.style.position = 'absolute';
        document.body.appendChild(draggedElement);
        
        moveElement(event.touches[0]); // Coloca el elemento en la posición inicial
    });

    image.addEventListener('touchmove', (event) => {
        if (draggedElement) {
            moveElement(event.touches[0]);
        }
        event.preventDefault();
    });

    image.addEventListener('touchend', (event) => {
        if (!draggedElement) return;

        let buildZone = document.getElementById('build-zone').getBoundingClientRect();
        let trashZone = document.getElementById('trash-zone').getBoundingClientRect();
        let touch = event.changedTouches[0];

        if (
            touch.clientX > buildZone.left &&
            touch.clientX < buildZone.right &&
            touch.clientY > buildZone.top &&
            touch.clientY < buildZone.bottom
        ) {
            document.getElementById('canvas').appendChild(draggedElement);
        } else if (
            touch.clientX > trashZone.left &&
            touch.clientX < trashZone.right &&
            touch.clientY > trashZone.top &&
            touch.clientY < trashZone.bottom
        ) {
            draggedElement.remove();
        } else {
            draggedElement.remove();
        }

        draggedElement = null;
    });
});

function moveElement(touch) {
    if (draggedElement) {
        draggedElement.style.left = `${touch.clientX - draggedElement.clientWidth / 2}px`;
        draggedElement.style.top = `${touch.clientY - draggedElement.clientHeight / 2}px`;
    }
}

// Botón para eliminar todo
document.querySelector('.trash-bin').addEventListener('click', () => {
    document.getElementById('canvas').innerHTML = '';
});
