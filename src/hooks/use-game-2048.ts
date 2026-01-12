import * as React from "react";
import { type GameState, type GameStatus, type Direction, type TileValue } from "@/lib/game-2048/types";
import { initializeTiles, moveTiles, addRandomTile, hasWon, canMove } from "@/lib/game-2048/logic";
import { loadGameState, saveGameState } from "@/lib/game-2048/storage";

interface UseGame2048Return {
    tiles: GameState["tiles"];
    score: number;
    bestScore: number;
    gameStatus: GameStatus;
    handleMove: (direction: Direction) => void;
    handleNewGame: () => void;
    continueGame: () => void;
}

export function useGame2048(): UseGame2048Return {
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

    return {
        tiles,
        score,
        bestScore,
        gameStatus,
        handleMove,
        handleNewGame,
        continueGame,
    };
}
