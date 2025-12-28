import { cn } from "@/lib/utils";
import { useSpotifyPresence } from "@/hooks/use-spotify-presence";

type SpotifyPresenceProps = {
    discordId: string;
    className?: string;
};

export function SpotifyPresence({ discordId, className }: SpotifyPresenceProps) {
    const { spotifyData, isPlaying } = useSpotifyPresence(discordId);

    if (!spotifyData || !isPlaying) {
        return null;
    }

    return (
        <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
            <span className="text-xs">Listening to</span>
            <div className="flex items-center gap-1.5">
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
