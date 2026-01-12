import { useEffect, useState, useRef, useCallback } from "react";

type SpotifyData = {
    song: string;
    artist: string;
    track_id: string;
} | null;

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 1000; // 1 second

export function useSpotifyPresence(discordId: string) {
    const [spotifyData, setSpotifyData] = useState<SpotifyData>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isCleaningUpRef = useRef(false);

    const clearHeartbeat = useCallback(() => {
        if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
            heartbeatIntervalRef.current = null;
        }
    }, []);

    const clearRetryTimeout = useCallback(() => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
    }, []);

    const connect = useCallback(() => {
        // Don't connect if we're cleaning up
        if (isCleaningUpRef.current) return;

        const socket = new WebSocket("wss://api.lanyard.rest/socket");
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Spotify socket opened");
            setIsConnected(true);
            // Reset retry count on successful connection
            retryCountRef.current = 0;
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
                clearHeartbeat();
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
            clearHeartbeat();

            // Don't retry if we're cleaning up
            if (isCleaningUpRef.current) return;

            // Attempt to reconnect with exponential backoff
            if (retryCountRef.current < MAX_RETRIES) {
                const delay = BASE_RETRY_DELAY * Math.pow(2, retryCountRef.current);
                console.log(`Retrying Spotify connection in ${delay}ms (attempt ${retryCountRef.current + 1}/${MAX_RETRIES})`);
                retryCountRef.current++;
                retryTimeoutRef.current = setTimeout(connect, delay);
            } else {
                console.log("Max retry attempts reached for Spotify connection");
            }
        };

        socket.onerror = (error) => {
            console.error("Spotify socket error:", error);
            // The socket will also fire onclose after onerror, so retry logic is handled there
        };
    }, [discordId, clearHeartbeat]);

    useEffect(() => {
        isCleaningUpRef.current = false;
        connect();

        return () => {
            isCleaningUpRef.current = true;
            clearHeartbeat();
            clearRetryTimeout();
            if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
        };
    }, [connect, clearHeartbeat, clearRetryTimeout]);

    return { spotifyData, isPlaying, isConnected };
}
