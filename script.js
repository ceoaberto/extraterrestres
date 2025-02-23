document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll(".menu-image");
    const canvas = document.getElementById("canvas");
    const trashBin = document.getElementById("trash-bin");

    menuItems.forEach(item => {
        item.addEventListener("touchstart", handleTouchStart, { passive: false });
    });

    function handleTouchStart(event) {
        event.preventDefault();
        let touch = event.touches[0];
        let clone = event.target.cloneNode(true);
        clone.classList.add("alien-part");
        clone.style.position = "absolute";

        // Ajusta el tamaño del clon al colocarlo en la zona de trabajo
        clone.style.width = "80px"; // Tamaño fijo
        clone.style.height = "80px"; // Tamaño fijo

        // Obtén la posición del canvas
        const canvasRect = canvas.getBoundingClientRect();

        // Ajusta las coordenadas relativas al canvas
        clone.style.left = touch.pageX - canvasRect.left + "px";
        clone.style.top = touch.pageY - canvasRect.top + "px";

        document.body.appendChild(clone);

        function moveElement(e) {
            if (e.touches.length === 1) {
                let moveTouch = e.touches[0];
                clone.style.left = moveTouch.pageX - canvasRect.left + "px";
                clone.style.top = moveTouch.pageY - canvasRect.top + "px";
            }
        }

        function endMove(e) {
            let dropTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            if (dropTarget && (dropTarget.id === "canvas" || dropTarget.closest("#canvas"))) {
                canvas.appendChild(clone);
                clone.style.position = "absolute";

                // Añade el evento de toque para escalar
                clone.addEventListener("touchend", function (e) {
                    e.preventDefault(); // Evita comportamientos no deseados
                    clone.classList.toggle("scaled"); // Alterna la clase "scaled"
                });
            } else {
                clone.remove();
            }
            clone.removeEventListener("touchmove", moveElement);
            clone.removeEventListener("touchend", endMove);
        }

        clone.addEventListener("touchmove", moveElement);
        clone.addEventListener("touchend", endMove);
    }

    // Eliminar todos los elementos del canvas
    trashBin.addEventListener("click", function () {
        while (canvas.firstChild) {
            canvas.removeChild(canvas.firstChild);
        }
    });
});
