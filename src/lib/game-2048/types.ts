// Types for 2048 game

export type TileValue = 0 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192;
export type GameStatus = "playing" | "won" | "lost";
export type Direction = "up" | "down" | "left" | "right";

export interface TileData {
    id: number;
    value: TileValue;
    row: number;
    col: number;
    prevRow?: number;
    prevCol?: number;
    isNew?: boolean;
    isMerged?: boolean;
    isMilestone?: boolean;
    /** For tiles that are merging into another tile (will be removed after animation) */
    mergingInto?: { row: number; col: number };
}

export interface GameState {
    tiles: TileData[];
    score: number;
    bestScore: number;
    gameStatus: GameStatus;
    highestTile: TileValue;
}

export interface StoredGameState {
    tiles: { id: number; value: TileValue; row: number; col: number }[];
    score: number;
    bestScore: number;
    gameStatus: GameStatus;
    highestTile: TileValue;
}

export interface MoveResult {
    tiles: TileData[];
    score: number;
    moved: boolean;
    mergedValues: TileValue[];
}

// Constants
export const STORAGE_KEY = "game-2048-state";
export const GRID_SIZE = 4;
