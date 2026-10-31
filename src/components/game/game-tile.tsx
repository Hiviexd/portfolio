import { cn } from "@/lib/utils";
import { type TileData } from "@/lib/game-2048/types";

interface GameTileProps {
    tile: TileData;
}

// Gap between cells (gap-1.5)
const GAP = 6;

export default function GameTile({ tile }: GameTileProps) {
    const { value, row, col, isNew, isMerged, isMilestone, mergingInto } = tile;

    const isMergingAway = !!mergingInto;

    return (
        // Slides via a transform transition; translate % is relative to the tile, so any cell size works
        <div
            className={cn(
                "game-2048-tile-position absolute left-0 top-0 h-14 w-14 sm:h-16 sm:w-16",
                isMergingAway ? "z-0" : isMerged ? "z-20" : "z-10",
            )}
            style={{
                transform: `translate(calc(${col} * (100% + ${GAP}px)), calc(${row} * (100% + ${GAP}px)))`,
            }}
        >
            <div
                className={cn(
                    "game-2048-tile flex h-full w-full items-center justify-center rounded-md font-bold",
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
                    value === 2048 && "game-2048-tile-2048",
                    value === 4096 && "game-2048-tile-4096",
                    value >= 8192 && "game-2048-tile-8192",
                    value > 0 && value < 8 && "text-lg",
                    value >= 8 && value < 128 && "text-lg text-white",
                    value >= 128 && value < 1024 && "text-base text-white",
                    value >= 1024 && "text-sm text-white",
                )}
            >
                {value > 0 ? value : ""}
            </div>
        </div>
    );
}
