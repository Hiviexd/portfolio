import * as React from "react";
import { type GameState, type GameStatus, type Direction, type TileValue } from "@/lib/game-2048/types";
import { initializeTiles, moveTiles, addRandomTile, hasWon, canMove } from "@/lib/game-2048/logic";
import { loadGameState, saveGameState } from "@/lib/game-2048/storage";
import { isMuted, playLoseJingle, playMergeFeedback, playWinJingle, setMuted } from "@/lib/game-2048/sound";

/** `id` changes on every event so its animation can replay */
export interface ScoreGain {
    id: number;
    value: number;
}

export interface RejectedMove {
    id: number;
    direction: Direction;
}

interface UseGame2048Return {
    tiles: GameState["tiles"];
    score: number;
    bestScore: number;
    gameStatus: GameStatus;
    scoreGain: ScoreGain | null;
    rejectedMove: RejectedMove | null;
    canUndo: boolean;
    handleMove: (direction: Direction) => void;
    handleUndo: () => void;
    handleNewGame: () => void;
    continueGame: () => void;
    muted: boolean;
    toggleMuted: () => void;
}

/** Strips animation state so undo doesn't replay pops or show merging tiles */
function toSnapshot(state: GameState): GameState {
    return {
        ...state,
        tiles: state.tiles
            .filter((t) => !t.mergingInto)
            .map(({ id, value, row, col }) => ({ id, value, row, col })),
    };
}

let eventIdCounter = 0;

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
    const [muted, setMutedState] = React.useState(isMuted);
    // Single-step undo, kept in memory only
    const [previousState, setPreviousState] = React.useState<GameState | null>(null);
    const [scoreGain, setScoreGain] = React.useState<ScoreGain | null>(null);
    const [rejectedMove, setRejectedMove] = React.useState<RejectedMove | null>(null);

    // Save game state whenever it changes
    React.useEffect(() => {
        saveGameState(gameState);
    }, [gameState]);

    const handleMove = React.useCallback(
        (direction: Direction) => {
            if (gameStatus !== "playing") return;

            const { tiles: newTiles, score: moveScore, moved, mergedValues } = moveTiles(tiles, direction, highestTile);

            if (!moved) {
                setRejectedMove({ id: ++eventIdCounter, direction });
                return;
            }

            const tilesWithNewTile = addRandomTile(newTiles);
            const newTotalScore = score + moveScore;
            const newBestScore = Math.max(bestScore, newTotalScore);
            const newHighestTile = Math.max(highestTile, ...mergedValues, 0) as TileValue;

            playMergeFeedback(mergedValues, newHighestTile > highestTile);
            if (moveScore > 0) {
                setScoreGain({ id: ++eventIdCounter, value: moveScore });
            }

            let newStatus: GameStatus = "playing";
            if (hasWon(tilesWithNewTile) && !hasWon(tiles)) {
                newStatus = "won";
            } else if (!canMove(tilesWithNewTile)) {
                newStatus = "lost";
            }

            if (newStatus === "won") playWinJingle();
            if (newStatus === "lost") playLoseJingle();

            setPreviousState(toSnapshot(gameState));
            setGameState({
                tiles: tilesWithNewTile,
                score: newTotalScore,
                bestScore: newBestScore,
                gameStatus: newStatus,
                highestTile: newHighestTile,
            });
        },
        [gameState, tiles, score, bestScore, gameStatus, highestTile],
    );

    const handleUndo = React.useCallback(() => {
        if (!previousState) return;
        // Best score is a record, so undoing a move doesn't take it back
        setGameState({ ...previousState, bestScore });
        setPreviousState(null);
        setScoreGain(null);
    }, [previousState, bestScore]);

    const handleNewGame = React.useCallback(() => {
        const initialTiles = initializeTiles();
        setGameState((prev) => ({
            tiles: initialTiles,
            score: 0,
            bestScore: prev.bestScore,
            gameStatus: "playing",
            highestTile: Math.max(...initialTiles.map((t) => t.value)) as TileValue,
        }));
        setPreviousState(null);
        setScoreGain(null);
    }, []);

    const continueGame = React.useCallback(() => {
        setGameState((prev) => ({
            ...prev,
            gameStatus: "playing",
        }));
    }, []);

    const toggleMuted = React.useCallback(() => {
        setMuted(!muted);
        setMutedState(!muted);
    }, [muted]);

    return {
        tiles,
        score,
        bestScore,
        gameStatus,
        scoreGain,
        rejectedMove,
        canUndo: previousState !== null,
        handleMove,
        handleUndo,
        handleNewGame,
        continueGame,
        muted,
        toggleMuted,
    };
}
