// LocalStorage operations for 2048 game

import { type GameState, type StoredGameState, STORAGE_KEY } from "./types";
import { setTileIdCounter } from "./logic";

export function loadGameState(): GameState | null {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved) as StoredGameState;
            // Restore tile ID counter
            setTileIdCounter(Math.max(...parsed.tiles.map((t) => t.id), 0));
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

export function saveGameState(state: GameState): void {
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
