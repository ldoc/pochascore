import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupSwipe } from './swipe.js';

function dispatchTouchEvent(el, type, x, y) {
  const touch = { identifier: 0, target: el, clientX: x, clientY: y };
  const event = new Event(type, { bubbles: true });
  event.touches = (type === 'touchstart' || type === 'touchmove') ? [touch] : [];
  event.changedTouches = type === 'touchend' ? [touch] : [];
  el.dispatchEvent(event);
}

function createMouse(type, x, y) {
  return new MouseEvent(type, { clientX: x, clientY: y, bubbles: true });
}

describe('setupSwipe', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls onSwipeLeft when swiping left (diffX > 50)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const onLeft = vi.fn();
    const onRight = vi.fn();
    setupSwipe(el, onLeft, onRight);

    dispatchTouchEvent(el, 'touchstart', 200, 100);
    dispatchTouchEvent(el, 'touchend', 100, 100);
    vi.advanceTimersByTime(300);

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
    vi.advanceTimersByTime(300);

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
    vi.advanceTimersByTime(300);

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
    vi.advanceTimersByTime(300);

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
    vi.advanceTimersByTime(300);

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
    vi.advanceTimersByTime(300);

    expect(onLeft).not.toHaveBeenCalled();
    expect(onRight).not.toHaveBeenCalled();
  });

  it('applies visual transform during drag', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setupSwipe(el, vi.fn(), vi.fn());

    dispatchTouchEvent(el, 'touchstart', 200, 100);
    dispatchTouchEvent(el, 'touchmove', 150, 100);

    expect(el.style.transform).toBe('translateX(-50px)');
    expect(el.style.opacity).not.toBe('1');
  });

  it('animates back when swipe is too small', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    setupSwipe(el, vi.fn(), vi.fn());

    dispatchTouchEvent(el, 'touchstart', 200, 100);
    dispatchTouchEvent(el, 'touchend', 170, 100);

    expect(el.style.transition).toContain('transform');
    expect(el.style.transform).toBe('translateX(0)');
    expect(el.style.opacity).toBe('1');
  });
});
