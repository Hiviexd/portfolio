import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Types
type TileValue = 0 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;
type GameStatus = "playing" | "won" | "lost";
type Direction = "up" | "down" | "left" | "right";

interface TileData {
    id: number;
    value: TileValue;
    row: number;
    col: number;
    prevRow?: number;
    prevCol?: number;
    isNew?: boolean;
    isMerged?: boolean;
    isMilestone?: boolean;
    // For tiles that are merging into another tile (will be removed after animation)
    mergingInto?: { row: number; col: number };
}

interface GameState {
    tiles: TileData[];
    score: number;
    bestScore: number;
    gameStatus: GameStatus;
    highestTile: TileValue;
}

interface StoredGameState {
    tiles: { id: number; value: TileValue; row: number; col: number }[];
    score: number;
    bestScore: number;
    gameStatus: GameStatus;
    highestTile: TileValue;
}

const STORAGE_KEY = "game-2048-state";
const GRID_SIZE = 4;
const SWIPE_THRESHOLD = 30;

let tileIdCounter = 0;
function getNextTileId(): number {
    return ++tileIdCounter;
}

// Helper functions
function getGridFromTiles(tiles: TileData[]): (TileData | null)[][] {
    const grid: (TileData | null)[][] = Array.from({ length: GRID_SIZE }, () =>
        Array(GRID_SIZE).fill(null),
    );
    for (const tile of tiles) {
        if (tile.value > 0 && !tile.mergingInto) {
            grid[tile.row][tile.col] = tile;
        }
    }
    return grid;
}

function getRandomEmptyCell(tiles: TileData[]): { row: number; col: number } | null {
    const grid = getGridFromTiles(tiles);
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (!grid[row][col]) {
                emptyCells.push({ row, col });
            }
        }
    }
    return emptyCells.length > 0 ? emptyCells[Math.floor(Math.random() * emptyCells.length)] : null;
}

function addRandomTile(tiles: TileData[]): TileData[] {
    // Remove any tiles that were merging (cleanup)
    const cleanedTiles = tiles.filter((t) => !t.mergingInto);
    const cell = getRandomEmptyCell(cleanedTiles);
    if (cell) {
        const newTile: TileData = {
            id: getNextTileId(),
            value: (Math.random() < 0.9 ? 2 : 4) as TileValue,
            row: cell.row,
            col: cell.col,
            isNew: true,
        };
        return [...cleanedTiles, newTile];
    }
    return cleanedTiles;
}

function initializeTiles(): TileData[] {
    let tiles: TileData[] = [];
    tiles = addRandomTile(tiles);
    tiles = addRandomTile(tiles);
    return tiles;
}

interface MoveResult {
    tiles: TileData[];
    score: number;
    moved: boolean;
    mergedValues: TileValue[];
}

function moveTiles(tiles: TileData[], direction: Direction, currentHighest: TileValue): MoveResult {
    // Clean up old animation flags and remove old merging tiles
    const cleanTiles = tiles
        .filter((t) => !t.mergingInto)
        .map((t) => ({
            ...t,
            isNew: false,
            isMerged: false,
            isMilestone: false,
            prevRow: t.row,
            prevCol: t.col,
        }));

    // Get delta for each direction (how tiles move in the grid)
    const deltas: Record<Direction, { dr: number; dc: number }> = {
        left: { dr: 0, dc: -1 },
        right: { dr: 0, dc: 1 },
        up: { dr: -1, dc: 0 },
        down: { dr: 1, dc: 0 },
    };

    // Order to process tiles based on direction
    const getProcessOrder = (direction: Direction): TileData[] => {
        const sorted = [...cleanTiles];
        switch (direction) {
            case "left":
                return sorted.sort((a, b) => a.col - b.col);
            case "right":
                return sorted.sort((a, b) => b.col - a.col);
            case "up":
                return sorted.sort((a, b) => a.row - b.row);
            case "down":
                return sorted.sort((a, b) => b.row - a.row);
        }
    };

    const { dr, dc } = deltas[direction];
    const orderedTiles = getProcessOrder(direction);

    // Track the new grid state
    const newGrid: (TileData | null)[][] = Array.from({ length: GRID_SIZE }, () =>
        Array(GRID_SIZE).fill(null),
    );

    // Track which positions have already merged (can only merge once per move)
    const mergedPositions = new Set<string>();

    let totalScore = 0;
    let moved = false;
    const resultTiles: TileData[] = [];
    const mergedValues: TileValue[] = [];
    const mergingTiles: TileData[] = []; // Tiles that slide into a merge

    for (const tile of orderedTiles) {
        let { row, col } = tile;
        const startRow = row;
        const startCol = col;

        // Move tile as far as possible
        while (true) {
            const nextRow = row + dr;
            const nextCol = col + dc;

            // Check bounds
            if (nextRow < 0 || nextRow >= GRID_SIZE || nextCol < 0 || nextCol >= GRID_SIZE) {
                break;
            }

            const targetTile = newGrid[nextRow][nextCol];

            // Empty cell - keep moving
            if (!targetTile) {
                row = nextRow;
                col = nextCol;
                continue;
            }

            // Check for merge
            const posKey = `${nextRow},${nextCol}`;
            if (targetTile.value === tile.value && !mergedPositions.has(posKey)) {
                // Merge!
                mergedPositions.add(posKey);
                const mergedValue = (tile.value * 2) as TileValue;
                const isMilestone = mergedValue > currentHighest;

                // Update the target tile to be the merged result
                targetTile.value = mergedValue;
                targetTile.isMerged = true;
                targetTile.isMilestone = isMilestone;

                totalScore += mergedValue;
                mergedValues.push(mergedValue);
                moved = true;

                // Add this tile as sliding into the merge position
                mergingTiles.push({
                    ...tile,
                    prevRow: startRow,
                    prevCol: startCol,
                    row: nextRow,
                    col: nextCol,
                    mergingInto: { row: nextRow, col: nextCol },
                });

                // Don't add this tile to result (it's consumed)
                row = -1; // Mark as merged
                break;
            }

            // Can't move further
            break;
        }

        // If tile wasn't merged, add it to result
        if (row >= 0) {
            if (row !== startRow || col !== startCol) {
                moved = true;
            }
            const newTile: TileData = {
                ...tile,
                prevRow: startRow,
                prevCol: startCol,
                row,
                col,
            };
            newGrid[row][col] = newTile;
            resultTiles.push(newTile);
        }
    }

    // Combine result tiles with merging tiles (for animation)
    return {
        tiles: [...resultTiles, ...mergingTiles],
        score: totalScore,
        moved,
        mergedValues,
    };
}

function hasWon(tiles: TileData[]): boolean {
    return tiles.some((t) => t.value >= 2048 && !t.mergingInto);
}

function canMove(tiles: TileData[]): boolean {
    const grid = getGridFromTiles(tiles);

    // Check for empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (!grid[row][col]) return true;
        }
    }

    // Check for possible merges
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const current = grid[row][col]?.value;
            if (col < GRID_SIZE - 1 && grid[row][col + 1]?.value === current) return true;
            if (row < GRID_SIZE - 1 && grid[row + 1][col]?.value === current) return true;
        }
    }

    return false;
}

function loadGameState(): GameState | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved) as StoredGameState;
            // Restore tile ID counter
            tileIdCounter = Math.max(...parsed.tiles.map((t) => t.id), 0);
            return {
                tiles: parsed.tiles.map((t) => ({
                    ...t,
                    isNew: false,
                    isMerged: false,
                    isMilestone: false,
                })),
                score: parsed.score,
                bestScore: parsed.bestScore,
                gameStatus: parsed.gameStatus,
                highestTile: parsed.highestTile,
            };
        }
    } catch {
        // Ignore errors
    }
    return null;
}

function saveGameState(state: GameState): void {
    try {
        const toSave: StoredGameState = {
            tiles: state.tiles
                .filter((t) => !t.mergingInto)
                .map((t) => ({
                    id: t.id,
                    value: t.value,
                    row: t.row,
                    col: t.col,
                })),
            score: state.score,
            bestScore: state.bestScore,
            gameStatus: state.gameStatus,
            highestTile: state.highestTile,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
        // Ignore errors
    }
}

// Tile component with animations
function Tile({ tile }: { tile: TileData }) {
    const { value, prevRow, prevCol, row, col, isNew, isMerged, isMilestone, mergingInto } = tile;

    // Calculate slide animation
    const deltaRow = prevRow !== undefined ? prevRow - row : 0;
    const deltaCol = prevCol !== undefined ? prevCol - col : 0;
    const hasSlide = deltaRow !== 0 || deltaCol !== 0;

    const tileSize = 64; // Approximate size for calculations
    const gap = 6;
    const translateX = deltaCol * (tileSize + gap);
    const translateY = deltaRow * (tileSize + gap);

    // Merging tiles fade out after sliding
    const isMergingAway = !!mergingInto;

    return (
        <div
            className={cn(
                "game-2048-tile flex items-center justify-center rounded-md font-bold",
                "h-14 w-14 sm:h-16 sm:w-16",
                hasSlide && "game-2048-slide",
                isNew && "game-2048-appear",
                isMerged && !isMilestone && "game-2048-merge",
                isMilestone && "game-2048-milestone",
                isMergingAway && "game-2048-merge-away",
                value === 0 && "bg-muted/50",
                value === 2 && ":dark:bg-secondary bg-gray-600/50 text-secondary-foreground",
                value === 4 && "game-2048-tile-4",
                value === 8 && "game-2048-tile-8",
                value === 16 && "game-2048-tile-16",
                value === 32 && "game-2048-tile-32",
                value === 64 && "game-2048-tile-64",
                value === 128 && "game-2048-tile-128",
                value === 256 && "game-2048-tile-256",
                value === 512 && "game-2048-tile-512",
                value === 1024 && "game-2048-tile-1024",
                value >= 2048 && "game-2048-tile-2048",
                value > 0 && value < 8 && "text-lg",
                value >= 8 && value < 128 && "text-lg text-white",
                value >= 128 && value < 1024 && "text-base text-white",
                value >= 1024 && "text-sm text-white",
            )}
            style={
                hasSlide
                    ? ({
                          "--slide-from-x": `${translateX}px`,
                          "--slide-from-y": `${translateY}px`,
                      } as React.CSSProperties)
                    : undefined
            }>
            {/* Show original value for merging-away tiles, new value for merged tiles */}
            {value > 0 ? value : ""}
        </div>
    );
}

// Grid cell background
function GridCell() {
    return <div className="h-14 w-14 rounded-md dark:bg-muted/50 bg-gray-300/50 sm:h-16 sm:w-16" />;
}

// Main game component
export function Game2048() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

    const [gameState, setGameState] = React.useState<GameState>(() => {
        const saved = loadGameState();
        if (saved) {
            return saved;
        }
        const initialTiles = initializeTiles();
        return {
            tiles: initialTiles,
            score: 0,
            bestScore: 0,
            gameStatus: "playing",
            highestTile: Math.max(...initialTiles.map((t) => t.value)) as TileValue,
        };
    });

    const { tiles, score, bestScore, gameStatus, highestTile } = gameState;

    // Save game state whenever it changes
    React.useEffect(() => {
        saveGameState(gameState);
    }, [gameState]);

    const handleMove = React.useCallback(
        (direction: Direction) => {
            if (gameStatus !== "playing") return;

            const { tiles: newTiles, score: moveScore, moved, mergedValues } = moveTiles(tiles, direction, highestTile);

            if (!moved) return;

            const tilesWithNewTile = addRandomTile(newTiles);
            const newTotalScore = score + moveScore;
            const newBestScore = Math.max(bestScore, newTotalScore);
            const newHighestTile = Math.max(highestTile, ...mergedValues, 0) as TileValue;

            let newStatus: GameStatus = "playing";
            if (hasWon(tilesWithNewTile) && !hasWon(tiles)) {
                newStatus = "won";
            } else if (!canMove(tilesWithNewTile)) {
                newStatus = "lost";
            }

            setGameState({
                tiles: tilesWithNewTile,
                score: newTotalScore,
                bestScore: newBestScore,
                gameStatus: newStatus,
                highestTile: newHighestTile,
            });
        },
        [tiles, score, bestScore, gameStatus, highestTile],
    );

    const handleNewGame = React.useCallback(() => {
        const initialTiles = initializeTiles();
        setGameState((prev) => ({
            tiles: initialTiles,
            score: 0,
            bestScore: prev.bestScore,
            gameStatus: "playing",
            highestTile: Math.max(...initialTiles.map((t) => t.value)) as TileValue,
        }));
    }, []);

    const continueGame = React.useCallback(() => {
        setGameState((prev) => ({
            ...prev,
            gameStatus: "playing",
        }));
    }, []);

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

    // Touch/swipe controls
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

            if (Math.max(absX, absY) < SWIPE_THRESHOLD) {
                touchStartRef.current = null;
                return;
            }

            let direction: Direction;
            if (absX > absY) {
                direction = deltaX > 0 ? "right" : "left";
            } else {
                direction = deltaY > 0 ? "down" : "up";
            }

            handleMove(direction);
            touchStartRef.current = null;
        },
        [handleMove],
    );

    // Mouse drag controls
    const mouseStartRef = React.useRef<{ x: number; y: number } | null>(null);

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

            handleMove(direction);
        },
        [handleMove],
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

    // Focus container on mount
    React.useEffect(() => {
        containerRef.current?.focus();
    }, []);

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex flex-col items-center gap-4 outline-none">
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

            {/* Game grid with touch/mouse support */}
            <div
                className="relative cursor-grab select-none rounded-lg bg-muted/70 p-2 active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}>
                {/* Background grid */}
                <div className="grid grid-cols-4 gap-1.5">
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                        <GridCell key={i} />
                    ))}
                </div>

                {/* Tile layer (grid positioned) */}
                <div className="pointer-events-none absolute inset-0 grid grid-cols-4 gap-1.5 p-2">
                    {/* Render tiles in grid positions */}
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                        const gridRow = Math.floor(i / GRID_SIZE);
                        const gridCol = i % GRID_SIZE;
                        const tile = tiles.find(
                            (t) => t.row === gridRow && t.col === gridCol && !t.mergingInto,
                        );
                        const mergingTile = tiles.find(
                            (t) =>
                                t.mergingInto &&
                                t.mergingInto.row === gridRow &&
                                t.mergingInto.col === gridCol,
                        );

                        return (
                            <div key={i} className="relative h-14 w-14 sm:h-16 sm:w-16">
                                {/* Merging tile (slides in and fades) */}
                                {mergingTile && <Tile tile={mergingTile} />}
                                {/* Main tile */}
                                {tile && <Tile tile={tile} />}
                            </div>
                        );
                    })}
                </div>

                {/* Game over overlay */}
                {gameStatus === "lost" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
                        <div className="mb-2 text-xl font-bold">Game Over!</div>
                        <Button variant="outline" size="sm" onClick={handleNewGame}>
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Win overlay */}
                {gameStatus === "won" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-xs">
                        <div className="mb-2 text-xl font-bold">You Win! 🎉</div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={continueGame}>
                                Keep Going
                            </Button>
                            <Button variant="default" size="sm" onClick={handleNewGame}>
                                New Game
                            </Button>
                        </div>
                    </div>
                )}
            </div>

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
