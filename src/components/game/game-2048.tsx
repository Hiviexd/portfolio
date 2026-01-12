import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGame2048 } from "@/hooks/use-game-2048";
import { useSwipe } from "@/hooks/use-swipe";
import { type Direction } from "@/lib/game-2048/types";
import GameGrid from "./game-grid";

export default function Game2048() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { tiles, score, bestScore, gameStatus, handleMove, handleNewGame, continueGame } = useGame2048();

    const swipeHandlers = useSwipe({ onSwipe: handleMove });

    // Keyboard controls
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            const keyMap: Record<string, Direction> = {
                ArrowUp: "up",
                ArrowDown: "down",
                ArrowLeft: "left",
                ArrowRight: "right",
            };

            const direction = keyMap[e.key];
            if (direction) {
                e.preventDefault();
                e.stopPropagation();
                handleMove(direction);
            }
        },
        [handleMove],
    );

    // Focus container on mount
    React.useEffect(() => {
        containerRef.current?.focus();
    }, []);

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex flex-col items-center gap-4 outline-none"
        >
            {/* Header with scores */}
            <div className="flex w-full items-center justify-between gap-3 pr-8">
                <div className="text-xl font-bold">2048</div>
                <div className="flex gap-2">
                    <div className="flex flex-col items-center rounded-md bg-muted px-3 py-1">
                        <span className="text-xs text-muted-foreground">Score</span>
                        <span className="font-bold">{score}</span>
                    </div>
                    <div className="flex flex-col items-center rounded-md bg-muted px-3 py-1">
                        <span className="text-xs text-muted-foreground">Best</span>
                        <span className="font-bold">{bestScore}</span>
                    </div>
                </div>
            </div>

            {/* Game grid */}
            <GameGrid
                tiles={tiles}
                gameStatus={gameStatus}
                onNewGame={handleNewGame}
                onContinue={continueGame}
                swipeHandlers={swipeHandlers}
            />

            {/* Controls */}
            <div className="flex w-full items-center justify-between">
                <Button variant="outline" size="sm" onClick={handleNewGame}>
                    New Game
                </Button>
                <span className="text-xs text-muted-foreground">Arrows or swipe</span>
            </div>
        </div>
    );
}
