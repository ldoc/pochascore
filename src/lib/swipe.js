export function setupSwipe(element, onSwipeLeft, onSwipeRight, onProgress) {
  let startX = 0;
  let startY = 0;
  let dragging = false;

  function onStart(x, y) {
    startX = x;
    startY = y;
    dragging = true;
    element.style.transition = 'none';
  }

  function onMove(x, y) {
    if (!dragging) return;
    const diffX = x - startX;
    const diffY = Math.abs(y - startY);
    if (diffY < 100) {
      element.style.transition = 'none';
      element.style.transform = `translateX(${diffX}px)`;
      element.style.opacity = String(1 - Math.abs(diffX) / 600);
      if (onProgress) onProgress(diffX);
    }
  }

  function onEnd(x, y) {
    if (!dragging) return;
    dragging = false;
    const diffX = startX - x;
    const diffY = Math.abs(startY - y);
    const swipeThreshold = 50;

    if (Math.abs(diffX) > swipeThreshold && diffY < 100) {
      const direction = diffX > 0 ? -1 : 1;
      const offscreen = direction * window.innerWidth;
      element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      element.style.transform = `translateX(${offscreen}px)`;
      element.style.opacity = '0';

      setTimeout(() => {
        element.style.transition = 'none';
        element.style.transform = '';
        element.style.opacity = '';
        if (diffX > 0) onSwipeLeft();
        else onSwipeRight();
      }, 300);
    } else {
      element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      element.style.transform = 'translateX(0)';
      element.style.opacity = '1';
      if (onProgress) onProgress(0);
    }
  }

  function handleTouchStart(e) {
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }

  function handleTouchMove(e) {
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  }

  function handleTouchEnd(e) {
    const t = e.changedTouches[0];
    onEnd(t.clientX, t.clientY);
  }

  function handleMouseDown(e) {
    onStart(e.clientX, e.clientY);
  }

  function handleMouseMove(e) {
    onMove(e.clientX, e.clientY);
  }

  function handleMouseUp(e) {
    onEnd(e.clientX, e.clientY);
  }

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchmove', handleTouchMove);
  element.addEventListener('touchend', handleTouchEnd);
  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseup', handleMouseUp);

  return {
    destroy() {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseup', handleMouseUp);
    }
  };
}
