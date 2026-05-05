import { useCallback, useRef, useState } from 'react';

export function useSnapCarousel({ count, index, onIndexChange, threshold = 48, velocityThreshold = 0.45 }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    locked: null,
    moved: false,
  });
  const suppressClickRef = useRef(false);

  const finishDrag = useCallback(() => {
    const pointer = pointerRef.current;
    if (!pointer.active) {
      return;
    }

    pointer.active = false;
    setIsDragging(false);

    const canGoPrevious = index > 0;
    const canGoNext = index < count - 1;
    const shouldGoNext =
      canGoNext && (dragX < -threshold || pointer.velocity < -velocityThreshold);
    const shouldGoPrevious =
      canGoPrevious && (dragX > threshold || pointer.velocity > velocityThreshold);

    if (shouldGoNext) {
      onIndexChange(index + 1);
    } else if (shouldGoPrevious) {
      onIndexChange(index - 1);
    }

    setDragX(0);

    if (pointer.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }, [count, dragX, index, onIndexChange, threshold, velocityThreshold]);

  const onPointerDown = useCallback((event) => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    pointerRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      locked: null,
      moved: false,
    };

    setIsDragging(false);
    setDragX(0);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event) => {
    const pointer = pointerRef.current;
    if (!pointer.active) {
      return;
    }

    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;

    if (!pointer.locked) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
        pointer.active = false;
        setDragX(0);
        setIsDragging(false);
        return;
      }

      if (Math.abs(dx) > 7) {
        pointer.locked = 'x';
        pointer.moved = true;
        setIsDragging(true);
      }
    }

    if (pointer.locked !== 'x') {
      return;
    }

    const now = performance.now();
    const dt = Math.max(1, now - pointer.lastTime);
    pointer.velocity = (event.clientX - pointer.lastX) / dt;
    pointer.lastX = event.clientX;
    pointer.lastTime = now;

    const atStart = index === 0 && dx > 0;
    const atEnd = index === count - 1 && dx < 0;
    setDragX(atStart || atEnd ? dx * 0.35 : dx);
  }, [count, index]);

  const onPointerUp = useCallback((event) => {
    try {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      }
    } catch (e) {
      // Ignore pointer ID errors
    }
    finishDrag();
  }, [finishDrag]);

  const onPointerCancel = useCallback(() => {
    pointerRef.current.active = false;
    setDragX(0);
    setIsDragging(false);
  }, []);

  const onClickCapture = useCallback((event) => {
    if (!suppressClickRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    dragX,
    isDragging,
    carouselHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
    },
  };
}
