document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const canvas = document.getElementById("canvas");
    const trashZone = document.getElementById("trash-zone");
    const clearAllBtn = document.getElementById("clear-all");

    menuItems.forEach(item => {
        item.addEventListener("touchstart", (e) => {
            e.preventDefault();
            createDraggableElement(e.target);
        }, { passive: false });
    });

    function createDraggableElement(element) {
        const newElement = document.createElement("div");
        newElement.classList.add("alien-part");
        newElement.style.position = "absolute";
        
        // Calcular un tamaño relativo basado en las dimensiones del canvas
        const canvasSize = Math.min(canvas.offsetWidth, canvas.offsetHeight);
        const initialSize = canvasSize * 0.15; // 15% de la dimensión más pequeña
        newElement.style.width = `${initialSize}px`;
        newElement.style.height = `${initialSize}px`;
        
        // Centrar el elemento en el canvas
        newElement.style.left = "50%";
        newElement.style.top = "50%";
        newElement.style.transform = "translate(-50%, -50%)";
        
        newElement.innerHTML = `<img src="${element.src}" style="width: 100%; height: 100%;">`;
        canvas.appendChild(newElement);
        makeElementDraggable(newElement);
        makeElementResizable(newElement);
    }

    function makeElementDraggable(element) {
        let startX, startY, initialX, initialY;

        element.addEventListener("touchstart", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
        }, { passive: false });

        element.addEventListener("touchmove", (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const moveX = touch.clientX - startX;
            const moveY = touch.clientY - startY;
            element.style.left = initialX + moveX + "px";
            element.style.top = initialY + moveY + "px";
        }, { passive: false });
    }

    function makeElementResizable(element) {
        let initialDistance = null;
        let scale = 1;

        element.addEventListener("touchmove", (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                
                if (initialDistance === null) {
                    initialDistance = distance;
                } else {
                    scale = distance / initialDistance;
                    // Mantener el centrado con translate y aplicar el escalado
                    element.style.transform = `translate(-50%, -50%) scale(${scale})`;
                }
            }
        }, { passive: false });

        element.addEventListener("touchend", () => {
            if(event.touches.length < 2){
                initialDistance = null;
            }
        });
    }

    trashZone.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        elements.forEach(el => {
            if (el.classList.contains("alien-part")) {
                el.remove();
            }
        });
    }, { passive: false });

    clearAllBtn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        canvas.innerHTML = "";
    }, { passive: false });
});
