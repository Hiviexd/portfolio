import * as React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Game2048 from "./game-2048";

interface Game2048DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function Game2048Dialog({ open, onOpenChange }: Game2048DialogProps) {
    // Prevent dialog from closing on arrow key press
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
            e.stopPropagation();
        }
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-sm"
                onKeyDown={handleKeyDown}
                showCloseButton={true}>
                <DialogTitle className="sr-only">2048 Game</DialogTitle>
                <DialogDescription className="sr-only">
                    Play 2048 - Use arrow keys to move tiles
                </DialogDescription>
                <Game2048 />
            </DialogContent>
        </Dialog>
    );
}
