import { useEffect, useState, useRef } from "react";

type SpotifyData = {
    song: string;
    artist: string;
    track_id: string;
} | null;

export function useSpotifyPresence(discordId: string) {
    const [spotifyData, setSpotifyData] = useState<SpotifyData>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const socket = new WebSocket("wss://api.lanyard.rest/socket");
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Spotify socket opened");
            setIsConnected(true);
            socket.send(
                JSON.stringify({
                    op: 2,
                    d: {
                        subscribe_to_id: discordId,
                    },
                }),
            );
        };

        socket.onmessage = ({ data }) => {
            const receivedPayload = JSON.parse(data);

            if (receivedPayload.op === 1) {
                // Heartbeat interval received
                if (heartbeatIntervalRef.current) {
                    clearInterval(heartbeatIntervalRef.current);
                }
                heartbeatIntervalRef.current = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({ op: 3 }));
                    }
                }, receivedPayload.d.heartbeat_interval);
            }

            if (receivedPayload.t === "INIT_STATE" || receivedPayload.t === "PRESENCE_UPDATE") {
                const spotify = receivedPayload.d?.spotify;
                if (spotify) {
                    setSpotifyData({
                        song: spotify.song,
                        artist: spotify.artist,
                        track_id: spotify.track_id,
                    });
                    setIsPlaying(true);
                } else {
                    setSpotifyData(null);
                    setIsPlaying(false);
                }
            }
        };

        socket.onclose = () => {
            console.log("Spotify socket closed");
            setIsConnected(false);
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            // Attempt to reconnect after a delay
            setTimeout(() => {
                if (socketRef.current?.readyState === WebSocket.CLOSED) {
                    // Reconnect logic could go here if needed
                }
            }, 5000);
        };

        socket.onerror = (error) => {
            console.error("Spotify socket error:", error);
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
        };

        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [discordId]);

    return { spotifyData, isPlaying, isConnected };
}
