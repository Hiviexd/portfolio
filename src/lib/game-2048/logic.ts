// Pure game logic functions for 2048

import { type TileData, type TileValue, type Direction, type MoveResult, GRID_SIZE } from "./types";

let tileIdCounter = 0;

export function getNextTileId(): number {
    return ++tileIdCounter;
}

export function setTileIdCounter(value: number): void {
    tileIdCounter = value;
}

export function getGridFromTiles(tiles: TileData[]): (TileData | null)[][] {
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

export function getRandomEmptyCell(tiles: TileData[]): { row: number; col: number } | null {
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

export function addRandomTile(tiles: TileData[]): TileData[] {
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

export function initializeTiles(): TileData[] {
    let tiles: TileData[] = [];
    tiles = addRandomTile(tiles);
    tiles = addRandomTile(tiles);
    return tiles;
}

export function moveTiles(tiles: TileData[], direction: Direction, currentHighest: TileValue): MoveResult {
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
    const getProcessOrder = (dir: Direction): TileData[] => {
        const sorted = [...cleanTiles];
        switch (dir) {
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

export function hasWon(tiles: TileData[]): boolean {
    return tiles.some((t) => t.value >= 2048 && !t.mergingInto);
}

export function canMove(tiles: TileData[]): boolean {
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
