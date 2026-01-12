import { cn } from "@/lib/utils";
import { type TileData } from "@/lib/game-2048/types";

interface GameTileProps {
    tile: TileData;
}

export default function GameTile({ tile }: GameTileProps) {
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
            style={
                hasSlide
                    ? ({
                          "--slide-from-x": `${translateX}px`,
                          "--slide-from-y": `${translateY}px`,
                      } as React.CSSProperties)
                    : undefined
            }
        >
            {value > 0 ? value : ""}
        </div>
    );
}
