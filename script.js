document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const canvas = document.getElementById("canvas");
    const trashZone = document.getElementById("trash-zone");
    const clearAllBtn = document.getElementById("clear-all");

    menuItems.forEach(item => {
        item.addEventListener("touchstart", (e) => {
            e.preventDefault();
            createDraggableElement(e.target);
        });
    });

    function createDraggableElement(element) {
        const newElement = document.createElement("div");
        newElement.classList.add("alien-part");
        newElement.style.position = "absolute";
        newElement.style.left = "50%";
        newElement.style.top = "50%";
        newElement.style.width = "80px";
        newElement.style.height = "80px";
        newElement.style.transformOrigin = "center center";
        newElement.innerHTML = `<img src="${element.src}" style="width: 100%; height: 100%;">`;
        canvas.appendChild(newElement);
        makeElementDraggable(newElement);
        makeElementResizable(newElement);
    }

    function makeElementDraggable(element) {
        let startX, startY, initialX, initialY;

        element.addEventListener("touchstart", (e) => {
            e.preventDefault();
            let touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
        });

        element.addEventListener("touchmove", (e) => {
            e.preventDefault();
            let touch = e.touches[0];
            let moveX = touch.clientX - startX;
            let moveY = touch.clientY - startY;
            element.style.left = initialX + moveX + "px";
            element.style.top = initialY + moveY + "px";
        });
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
                    element.style.transform = `scale(${scale})`;
                }
            }
        });

        element.addEventListener("touchend", () => {
            initialDistance = null;
        });
    }

    trashZone.addEventListener("touchmove", (e) => {
        e.preventDefault();
        let touch = e.touches[0];
        let elements = document.elementsFromPoint(touch.clientX, touch.clientY);
        elements.forEach(el => {
            if (el.classList.contains("alien-part")) {
                el.remove();
            }
        });
    });

    clearAllBtn.addEventListener("touchstart", () => {
        canvas.innerHTML = "";
    });
});
