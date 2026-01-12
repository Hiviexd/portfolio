import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Game2048Dialog } from "@/components/misc/game-2048-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { GameController02Icon } from "@hugeicons/core-free-icons";

export function Footer() {
    const [gameOpen, setGameOpen] = React.useState(false);

    return (
        <>
            <footer className="mt-16 flex items-center justify-between border-t border-border pt-8 text-sm text-muted-foreground">
                <p>Built with TanStack Start & shadcn/ui</p>
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setGameOpen(true)}
                                className="text-muted-foreground hover:text-foreground"
                            />
                        }>
                        <HugeiconsIcon icon={GameController02Icon} size={16} strokeWidth={2} />
                        <span className="sr-only">Play 2048</span>
                    </TooltipTrigger>
                    <TooltipContent>Play 2048</TooltipContent>
                </Tooltip>
            </footer>
            <Game2048Dialog open={gameOpen} onOpenChange={setGameOpen} />
        </>
    );
}
