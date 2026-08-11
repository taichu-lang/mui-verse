"use client";

import { useCallback, useRef } from "react";

type LongPressCallback = (e: React.MouseEvent | React.TouchEvent) => void;
type SingleClickCallback = (e: React.MouseEvent | React.TouchEvent) => void;

interface UseLongPressOptions {
  delay?: number;
  threshold?: number;
}

export function useLongPress({
  onLongPress,
  onClick,
  options,
}: {
  onLongPress: LongPressCallback;
  onClick?: SingleClickCallback;
  options?: UseLongPressOptions;
}) {
  const { delay = 500, threshold = 300 } = options || {};

  const isLongPressActive = useRef<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastClickTime = useRef<number>(0);

  const startPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isLongPressActive.current = false;
      timer.current = setTimeout(() => {
        isLongPressActive.current = true;
        onLongPress(e);
      }, delay);
    },
    [onLongPress, delay],
  );

  const endPress = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      // isLongPressActive has not been unset, single click.
      if (!isLongPressActive.current && onClick) {
        const now = Date.now();

        // Avoid multiple clicks in a short time.
        if (now - lastClickTime.current > threshold) {
          onClick(e);
          lastClickTime.current = now;
        }
      }
    },
    [onClick, threshold],
  );

  const cancelPress = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    isLongPressActive.current = false;
  }, []);

  return {
    onMouseDown: startPress,
    onMouseUp: endPress,
    onMouseLeave: cancelPress,
    onTouchStart: startPress,
    onTouchEnd: endPress,
    onTouchMove: cancelPress,
  };
}
