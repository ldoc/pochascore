import { describe, it, expect, vi } from 'vitest';
import { setupSwipe } from './swipe.js';

function dispatchTouchEvent(el, type, x, y) {
  const touch = { identifier: 0, target: el, clientX: x, clientY: y };
  const event = new Event(type, { bubbles: true });
  event.touches = type === 'touchstart' ? [touch] : [];
  event.changedTouches = type === 'touchend' ? [touch] : [];
  el.dispatchEvent(event);
}

function createMouse(type, x, y) {
  return new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });
}

describe('setupSwipe', () => {
  it('calls onSwipeLeft when swiping left (diffX > 50)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onLeft = vi.fn();
    const onRight = vi.fn();
    setupSwipe(el, onLeft, onRight);

    dispatchTouchEvent(el, 'touchstart', 200, 100);
    dispatchTouchEvent(el, 'touchend', 100, 100);

    expect(onLeft).toHaveBeenCalledOnce();
    expect(onRight).not.toHaveBeenCalled();
  });

  it('calls onSwipeRight when swiping right (diffX < -50)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onLeft = vi.fn();
    const onRight = vi.fn();
    setupSwipe(el, onLeft, onRight);

    dispatchTouchEvent(el, 'touchstart', 100, 100);
    dispatchTouchEvent(el, 'touchend', 200, 100);

    expect(onRight).toHaveBeenCalledOnce();
    expect(onLeft).not.toHaveBeenCalled();
  });

  it('does not call callbacks for small swipes (< 50px)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onLeft = vi.fn();
    const onRight = vi.fn();
    setupSwipe(el, onLeft, onRight);

    dispatchTouchEvent(el, 'touchstart', 100, 100);
    dispatchTouchEvent(el, 'touchend', 120, 100);

    expect(onLeft).not.toHaveBeenCalled();
    expect(onRight).not.toHaveBeenCalled();
  });

  it('does not call callbacks when vertical movement >= 100', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onLeft = vi.fn();
    const onRight = vi.fn();
    setupSwipe(el, onLeft, onRight);

    dispatchTouchEvent(el, 'touchstart', 200, 100);
    dispatchTouchEvent(el, 'touchend', 100, 250);

    expect(onLeft).not.toHaveBeenCalled();
    expect(onRight).not.toHaveBeenCalled();
  });

  it('works with mouse events', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onLeft = vi.fn();
    const onRight = vi.fn();
    setupSwipe(el, onLeft, onRight);

    el.dispatchEvent(createMouse('mousedown', 200, 100));
    el.dispatchEvent(createMouse('mouseup', 100, 100));

    expect(onLeft).toHaveBeenCalledOnce();
    expect(onRight).not.toHaveBeenCalled();
  });

  it('returns a destroy function that removes listeners', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onLeft = vi.fn();
    const onRight = vi.fn();
    const { destroy } = setupSwipe(el, onLeft, onRight);

    destroy();

    dispatchTouchEvent(el, 'touchstart', 200, 100);
    dispatchTouchEvent(el, 'touchend', 100, 100);

    expect(onLeft).not.toHaveBeenCalled();
    expect(onRight).not.toHaveBeenCalled();
  });
});
