import * as React from "react";
import { type Direction } from "@/lib/game-2048/types";

const SWIPE_THRESHOLD = 30;

interface UseSwipeOptions {
    onSwipe: (direction: Direction) => void;
}

interface SwipeHandlers {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
}

export function useSwipe({ onSwipe }: UseSwipeOptions): SwipeHandlers {
    const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);
    const mouseStartRef = React.useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }, []);

    const handleTouchEnd = React.useCallback(
        (e: React.TouchEvent) => {
            if (!touchStartRef.current) return;

            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - touchStartRef.current.x;
            const deltaY = touch.clientY - touchStartRef.current.y;

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            touchStartRef.current = null;

            if (Math.max(absX, absY) < SWIPE_THRESHOLD) {
                return;
            }

            let direction: Direction;
            if (absX > absY) {
                direction = deltaX > 0 ? "right" : "left";
            } else {
                direction = deltaY > 0 ? "down" : "up";
            }

            onSwipe(direction);
        },
        [onSwipe],
    );

    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        mouseStartRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    const processMouseEnd = React.useCallback(
        (clientX: number, clientY: number) => {
            if (!mouseStartRef.current) return;

            const deltaX = clientX - mouseStartRef.current.x;
            const deltaY = clientY - mouseStartRef.current.y;

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            mouseStartRef.current = null;

            if (Math.max(absX, absY) < SWIPE_THRESHOLD) {
                return;
            }

            let direction: Direction;
            if (absX > absY) {
                direction = deltaX > 0 ? "right" : "left";
            } else {
                direction = deltaY > 0 ? "down" : "up";
            }

            onSwipe(direction);
        },
        [onSwipe],
    );

    const handleMouseUp = React.useCallback(
        (e: React.MouseEvent) => {
            processMouseEnd(e.clientX, e.clientY);
        },
        [processMouseEnd],
    );

    const handleMouseLeave = React.useCallback(
        (e: React.MouseEvent) => {
            processMouseEnd(e.clientX, e.clientY);
        },
        [processMouseEnd],
    );

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseLeave,
    };
}
