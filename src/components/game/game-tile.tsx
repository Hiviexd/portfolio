import { cn } from "@/lib/utils";
import { type TileData } from "@/lib/game-2048/types";

interface GameTileProps {
    tile: TileData;
}

export default function GameTile({ tile }: GameTileProps) {
    const { value, prevRow, prevCol, row, col, isNew, isMerged, isMilestone, mergingInto } = tile;

    // For tiles that are merging away, use their target position for grid placement
    const targetRow = mergingInto ? mergingInto.row : row;
    const targetCol = mergingInto ? mergingInto.col : col;

    // Calculate slide animation offset (from previous position to current)
    // Cell size is 56px (h-14/w-14) on mobile, 64px on sm+, gap is 6px
    const cellSize = 56;
    const gap = 6;

    const hasSlide = prevRow !== undefined && prevCol !== undefined && (prevRow !== row || prevCol !== col);
    const slideFromX = hasSlide ? (prevCol! - col) * (cellSize + gap) : 0;
    const slideFromY = hasSlide ? (prevRow! - row) * (cellSize + gap) : 0;

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
                value === 2 && "dark:bg-secondary bg-gray-600/50 text-secondary-foreground",
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
            style={{
                gridRow: targetRow + 1,
                gridColumn: targetCol + 1,
                ...(hasSlide && {
                    "--slide-from-x": `${slideFromX}px`,
                    "--slide-from-y": `${slideFromY}px`,
                }),
            } as React.CSSProperties}
        >
            {value > 0 ? value : ""}
        </div>
    );
}
