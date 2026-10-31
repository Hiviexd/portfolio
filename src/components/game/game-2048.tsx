import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, VolumeMute02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useGame2048 } from "@/hooks/use-game-2048";
import { useSwipe } from "@/hooks/use-swipe";
import { type Direction } from "@/lib/game-2048/types";
import GameGrid from "./game-grid";

const KEY_DIRECTIONS: Partial<Record<string, Direction>> = {
    arrowup: "up",
    arrowdown: "down",
    arrowleft: "left",
    arrowright: "right",
};

const CONFIRM_TIMEOUT = 3000;

export default function Game2048() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const {
        tiles,
        score,
        bestScore,
        gameStatus,
        scoreGain,
        rejectedMove,
        canUndo,
        handleMove,
        handleUndo,
        handleNewGame,
        continueGame,
        muted,
        toggleMuted,
    } = useGame2048();
    const [confirmingNewGame, setConfirmingNewGame] = React.useState(false);

    const swipeHandlers = useSwipe({ onSwipe: handleMove });

    // Undo and the overlay buttons disable/unmount on click, which drops focus and breaks keyboard moves
    const refocus = React.useCallback(() => containerRef.current?.focus(), []);
    const undoAndRefocus = React.useCallback(() => {
        handleUndo();
        refocus();
    }, [handleUndo, refocus]);
    const newGameAndRefocus = React.useCallback(() => {
        handleNewGame();
        refocus();
    }, [handleNewGame, refocus]);
    const continueAndRefocus = React.useCallback(() => {
        continueGame();
        refocus();
    }, [continueGame, refocus]);

    // Keyboard controls
    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            const key = e.key.toLowerCase();

            if (key === "z" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleUndo();
                return;
            }

            if (e.ctrlKey || e.metaKey || e.altKey) return;

            const direction = KEY_DIRECTIONS[key];
            if (direction) {
                e.preventDefault();
                e.stopPropagation();
                handleMove(direction);
            }
        },
        [handleMove, handleUndo],
    );

    const handleNewGameClick = () => {
        if (score === 0 || confirmingNewGame) {
            setConfirmingNewGame(false);
            handleNewGame();
        } else {
            setConfirmingNewGame(true);
        }
    };

    React.useEffect(() => {
        if (!confirmingNewGame) return;
        const timeout = setTimeout(() => setConfirmingNewGame(false), CONFIRM_TIMEOUT);
        return () => clearTimeout(timeout);
    }, [confirmingNewGame]);

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
                    <div className="relative flex flex-col items-center rounded-md bg-muted px-3 py-1">
                        <span className="text-xs text-muted-foreground">Score</span>
                        <span className="font-bold">{score}</span>
                        {/* Keyed by id so the animation replays */}
                        {scoreGain && (
                            <span
                                key={scoreGain.id}
                                className="game-2048-score-gain pointer-events-none absolute inset-x-0 bottom-1 text-center text-sm font-bold"
                            >
                                +{scoreGain.value}
                            </span>
                        )}
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
                rejectedMove={rejectedMove}
                onNewGame={newGameAndRefocus}
                onContinue={continueAndRefocus}
                swipeHandlers={swipeHandlers}
            />

            {/* Controls */}
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant={confirmingNewGame ? "destructive" : "outline"}
                        size="sm"
                        className="min-w-22"
                        onClick={handleNewGameClick}
                    >
                        {confirmingNewGame ? "Confirm?" : "New Game"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={undoAndRefocus} disabled={!canUndo} title="Undo (Ctrl+Z)">
                        Undo
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Arrows or swipe</span>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={toggleMuted}
                        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
                        title={muted ? "Unmute sounds" : "Mute sounds"}
                    >
                        <HugeiconsIcon icon={muted ? VolumeMute02Icon : VolumeHighIcon} className="size-4" strokeWidth={2} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
