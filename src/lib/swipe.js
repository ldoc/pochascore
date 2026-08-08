export function setupSwipe(element, onSwipeLeft, onSwipeRight) {
  let startX = 0;
  let startY = 0;

  function onStart(x, y) {
    startX = x;
    startY = y;
  }

  function onEnd(x, y) {
    const diffX = startX - x;
    const diffY = Math.abs(startY - y);
    if (Math.abs(diffX) > 50 && diffY < 100) {
      if (diffX > 0) onSwipeLeft();
      else onSwipeRight();
    }
  }

  function handleTouchStart(e) {
    const t = e.touches[0];
    onStart(t.clientX, t.clientY);
  }

  function handleTouchEnd(e) {
    const t = e.changedTouches[0];
    onEnd(t.clientX, t.clientY);
  }

  function handleMouseDown(e) {
    onStart(e.clientX, e.clientY);
  }

  function handleMouseUp(e) {
    onEnd(e.clientX, e.clientY);
  }

  element.addEventListener('touchstart', handleTouchStart);
  element.addEventListener('touchend', handleTouchEnd);
  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('mouseup', handleMouseUp);

  return {
    destroy() {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
    }
  };
}
