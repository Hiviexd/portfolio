import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSpotifyPresence } from "@/hooks/use-spotify-presence";
import { HugeiconsIcon } from "@hugeicons/react";
import { MusicNote01Icon } from "@hugeicons/core-free-icons";
import metadata from "../../data/metadata.json";

type SpotifyPresenceProps = {
    className?: string;
};

export function SpotifyPresence({ className }: SpotifyPresenceProps) {
    const { spotifyData, isPlaying, isConnected } = useSpotifyPresence(metadata.discordId);
    const [showNotPlaying, setShowNotPlaying] = useState(false);

    // Delay showing "Not playing" to avoid flash on initial load
    useEffect(() => {
        if (isConnected && !isPlaying) {
            // Wait .2 seconds before showing "Not playing"
            const timer = setTimeout(() => {
                setShowNotPlaying(true);
            }, 200);

            return () => clearTimeout(timer);
        } else {
            // Reset the delay if we start playing
            setShowNotPlaying(false);
        }
    }, [isConnected, isPlaying]);

    // Don't show anything if not connected
    if (!isConnected) {
        return null;
    }

    // Show "not playing" state when connected but nothing is playing (after delay)
    if ((!spotifyData || !isPlaying) && showNotPlaying) {
        return (
            <div
                className={cn(
                    "flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-300",
                    className,
                )}>
                <HugeiconsIcon icon={MusicNote01Icon} className="size-3.5 text-green-500" strokeWidth={2} />
                <span className="text-xs">Not playing</span>
            </div>
        );
    }

    // Show currently playing track
    if (!spotifyData) {
        return null;
    }

    return (
        <div
            className={cn(
                "flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in duration-300",
                className,
            )}>
            <HugeiconsIcon icon={MusicNote01Icon} className="size-3.5 text-green-500" strokeWidth={2} />
            <span className="text-xs flex-shrink-0">Listening to</span>
            <div className="flex items-center gap-1.5 flex-1">
                <div className="flex items-center gap-0.5">
                    <span className="inline-block w-0.5 h-3 bg-green-500 animate-[wave_1s_ease-in-out_infinite] [animation-delay:0s]" />
                    <span className="inline-block w-0.5 h-3 bg-green-500 animate-[wave_1s_ease-in-out_infinite] [animation-delay:0.1s]" />
                    <span className="inline-block w-0.5 h-3 bg-green-500 animate-[wave_1s_ease-in-out_infinite] [animation-delay:0.2s]" />
                </div>
                <a
                    href={`https://open.spotify.com/track/${spotifyData.track_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-fancy text-foreground text-xs transition-colors">
                    {spotifyData.song} — {spotifyData.artist}
                </a>
            </div>
        </div>
    );
}
