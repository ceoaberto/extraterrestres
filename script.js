document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  const trashZone = document.getElementById('trash-zone');
  const menuImages = document.querySelectorAll('.touch-draggable');
  
  // Función para clonar la imagen al canvas
  function addPartToCanvas(event) {
    const img = event.target;
    const clone = img.cloneNode(true);
    clone.classList.add('alien-part');
    // Posicionar el clon en el centro del canvas inicialmente
    clone.style.left = (canvas.offsetWidth / 2 - img.offsetWidth / 2) + 'px';
    clone.style.top = (canvas.offsetHeight / 2 - img.offsetHeight / 2) + 'px';
    canvas.appendChild(clone);
    makeDraggable(clone);
  }
  
  // Hacer elementos arrastrables
  function makeDraggable(element) {
    let offsetX = 0, offsetY = 0;
    let isDragging = false;
    
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag);
    
    function startDrag(e) {
      isDragging = true;
      const event = e.type === 'touchstart' ? e.touches[0] : e;
      offsetX = event.clientX - element.getBoundingClientRect().left;
      offsetY = event.clientY - element.getBoundingClientRect().top;
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
      e.preventDefault();
    }
    
    function drag(e) {
      if (!isDragging) return;
      const event = e.type === 'touchmove' ? e.touches[0] : e;
      // Calcular posición relativa al canvas
      const canvasRect = canvas.getBoundingClientRect();
      let x = event.clientX - canvasRect.left - offsetX;
      let y = event.clientY - canvasRect.top - offsetY;
      
      // Limitar el movimiento dentro del canvas
      x = Math.max(0, Math.min(x, canvas.offsetWidth - element.offsetWidth));
      y = Math.max(0, Math.min(y, canvas.offsetHeight - element.offsetHeight));
      
      element.style.left = x + 'px';
      element.style.top = y + 'px';
    }
    
    function endDrag(e) {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
      
      // Verificar si el elemento se soltó en la zona de eliminación
      const trashRect = trashZone.getBoundingClientRect();
      const elemRect = element.getBoundingClientRect();
      if (elemRect.left < trashRect.right &&
          elemRect.right > trashRect.left &&
          elemRect.top < trashRect.bottom &&
          elemRect.bottom > trashRect.top) {
            element.remove();
      }
    }
  }
  
  // Agregar evento a cada imagen del menú
  menuImages.forEach(img => {
    img.addEventListener('click', addPartToCanvas);
    img.addEventListener('touchend', addPartToCanvas);
  });
  
  // Función para eliminar todos los elementos del canvas
  document.querySelector('.trash-bin').addEventListener('click', function() {
    canvas.innerHTML = '';
  });
});
