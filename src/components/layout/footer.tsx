import * as React from "react";
import { Button } from "@/components/ui/button";
import Game2048Dialog from "@/components/game/game-2048-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon, GameController02Icon } from "@hugeicons/core-free-icons";

export function Footer() {
    const [gameOpen, setGameOpen] = React.useState(false);

    return (
        <>
            <footer className="mt-16 flex items-center justify-between border-t border-border pt-8 text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-1">
                    Made with <HugeiconsIcon icon={FavouriteIcon} size={16} strokeWidth={2} />
                </p>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setGameOpen(true)}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <HugeiconsIcon icon={GameController02Icon} size={16} strokeWidth={2} />
                    Play 2048
                </Button>
            </footer>
            <Game2048Dialog open={gameOpen} onOpenChange={setGameOpen} />
        </>
    );
}
