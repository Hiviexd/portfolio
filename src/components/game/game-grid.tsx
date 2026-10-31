import * as React from "react";
import { type TileData, type GameStatus, type Direction, GRID_SIZE } from "@/lib/game-2048/types";
import { type RejectedMove } from "@/hooks/use-game-2048";
import { Button } from "@/components/ui/button";
import GameTile from "./game-tile";

function GridCell() {
    return <div className="h-14 w-14 rounded-md bg-gray-300/50 dark:bg-muted/50 sm:h-16 sm:w-16" />;
}

interface GameGridProps {
    tiles: TileData[];
    gameStatus: GameStatus;
    rejectedMove: RejectedMove | null;
    onNewGame: () => void;
    onContinue: () => void;
    swipeHandlers: {
        onTouchStart: React.TouchEventHandler;
        onTouchEnd: React.TouchEventHandler;
        onMouseDown: React.MouseEventHandler;
        onMouseUp: React.MouseEventHandler;
        onMouseLeave: React.MouseEventHandler;
    };
}

const NUDGE_OFFSETS: Record<Direction, [number, number]> = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
};

export default function GameGrid({ tiles, gameStatus, rejectedMove, onNewGame, onContinue, swipeHandlers }: GameGridProps) {
    const boardRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!rejectedMove || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const [x, y] = NUDGE_OFFSETS[rejectedMove.direction];
        boardRef.current?.animate(
            [
                { transform: "translate(0, 0)" },
                { transform: `translate(${x * 4}px, ${y * 4}px)` },
                { transform: "translate(0, 0)" },
            ],
            { duration: 150, easing: "ease-out" },
        );
    }, [rejectedMove]);

    return (
        <div
            ref={boardRef}
            className="relative cursor-grab select-none rounded-lg bg-muted/70 p-2 active:cursor-grabbing"
            {...swipeHandlers}
        >
            {/* Background grid */}
            <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                    <GridCell key={i} />
                ))}
            </div>

            {/* Tile layer - isolate keeps tile z-indexes below the overlays */}
            <div className="pointer-events-none absolute inset-2 isolate">
                {/* Stable id order: reordering DOM nodes cancels their slide transitions */}
                {[...tiles]
                    .sort((a, b) => a.id - b.id)
                    .map((tile) => (
                        <GameTile key={tile.id} tile={tile} />
                    ))}
            </div>

            {/* Game over overlay */}
            {gameStatus === "lost" && (
                <div className="game-2048-overlay-delayed absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
                    <div className="mb-2 text-xl font-bold">Game Over!</div>
                    <Button variant="outline" size="sm" onClick={onNewGame}>
                        Try Again
                    </Button>
                </div>
            )}

            {/* Win overlay */}
            {gameStatus === "won" && (
                <div className="game-2048-overlay-delayed absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
                    <div className="mb-2 text-xl font-bold">You Win! 🎉</div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={onContinue}>
                            Keep Going
                        </Button>
                        <Button variant="default" size="sm" onClick={onNewGame}>
                            New Game
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
