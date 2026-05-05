import { useEffect, useRef, useState } from 'react';

export function useReaderGestures({ 
  count, 
  index, 
  onIndexChange, 
  onCenterTap,
  thresholdPercent = 0.35 
}) {
  const [dragX, setDragX] = useState(0);
  const [isSnapping, setIsSnapping] = useState(false);
  
  const shellRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  
  // Keep refs in sync for handlers
  const indexRef = useRef(index);
  useEffect(() => { indexRef.current = index; }, [index]);

  const countRef = useRef(count);
  useEffect(() => { countRef.current = count; }, [count]);

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    function onTouchStart(e) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = false;
      setIsSnapping(false);
    }

    function onTouchMove(e) {
      if (touchStartX.current === null) return;
      
      const dx = e.touches[0].clientX - touchStartX.current;
      const dy = e.touches[0].clientY - touchStartY.current;

      if (!isDragging.current) {
        // Lock to horizontal if swiped more than 8px and dx > dy
        if (Math.abs(dy) > Math.abs(dx)) {
          touchStartX.current = null;
          return;
        }
        if (Math.abs(dx) > 8) {
          isDragging.current = true;
        }
      }

      if (isDragging.current) {
        // Prevent default only when we are sure it's a horizontal swipe
        if (e.cancelable) e.preventDefault();
        setDragX(dx);
      }
    }

    function onTouchEnd(e) {
      if (touchStartX.current === null) return;
      
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const startX = touchStartX.current;
      touchStartX.current = null;

      if (!isDragging.current) {
        // It was a tap
        const width = window.innerWidth;
        const tapX = startX;
        
        if (tapX < width * 0.25) {
          onIndexChange(Math.max(0, indexRef.current - 1));
        } else if (tapX > width * 0.75) {
          onIndexChange(Math.min(countRef.current - 1, indexRef.current + 1));
        } else {
          onCenterTap?.();
        }
        return;
      }

      // It was a drag
      const threshold = window.innerWidth * thresholdPercent;
      setIsSnapping(true);
      setDragX(0);

      if (dx < -threshold && indexRef.current < countRef.current - 1) {
        onIndexChange(indexRef.current + 1);
      } else if (dx > threshold && indexRef.current > 0) {
        onIndexChange(indexRef.current - 1);
      }

      setTimeout(() => setIsSnapping(false), 350);
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onIndexChange, onCenterTap, thresholdPercent]);

  return { shellRef, dragX, isSnapping };
}
