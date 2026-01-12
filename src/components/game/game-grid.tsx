import { type TileData, type GameStatus, GRID_SIZE } from "@/lib/game-2048/types";
import { Button } from "@/components/ui/button";
import GameTile from "./game-tile";

function GridCell() {
    return <div className="h-14 w-14 rounded-md bg-gray-300/50 dark:bg-muted/50 sm:h-16 sm:w-16" />;
}

interface GameGridProps {
    tiles: TileData[];
    gameStatus: GameStatus;
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

export default function GameGrid({ tiles, gameStatus, onNewGame, onContinue, swipeHandlers }: GameGridProps) {
    return (
        <div
            className="relative cursor-grab select-none rounded-lg bg-muted/70 p-2 active:cursor-grabbing"
            {...swipeHandlers}
        >
            {/* Background grid */}
            <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                    <GridCell key={i} />
                ))}
            </div>

            {/* Tile layer (grid positioned) */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-4 gap-1.5 p-2">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                    const gridRow = Math.floor(i / GRID_SIZE);
                    const gridCol = i % GRID_SIZE;
                    const tile = tiles.find((t) => t.row === gridRow && t.col === gridCol && !t.mergingInto);
                    const mergingTile = tiles.find(
                        (t) => t.mergingInto && t.mergingInto.row === gridRow && t.mergingInto.col === gridCol,
                    );

                    return (
                        <div key={i} className="relative h-14 w-14 sm:h-16 sm:w-16">
                            {/* Merging tile (slides in and fades) */}
                            {mergingTile && <GameTile tile={mergingTile} />}
                            {/* Main tile */}
                            {tile && <GameTile tile={tile} />}
                        </div>
                    );
                })}
            </div>

            {/* Game over overlay */}
            {gameStatus === "lost" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
                    <div className="mb-2 text-xl font-bold">Game Over!</div>
                    <Button variant="outline" size="sm" onClick={onNewGame}>
                        Try Again
                    </Button>
                </div>
            )}

            {/* Win overlay */}
            {gameStatus === "won" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
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
