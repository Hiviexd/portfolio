import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type CopyActionIconProps = {
    icon: IconSvgElement;
    value: string;
    tooltip: string;
    copiedTooltip?: string;
    className?: string;
};

export function CopyActionIcon({
    icon,
    value,
    tooltip,
    copiedTooltip = "Copied!",
    className,
}: CopyActionIconProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "relative inline-flex items-center justify-center size-8 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                            copied
                                ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                                : "border-transparent hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
                            className,
                        )}>
                        <HugeiconsIcon
                            icon={icon}
                            strokeWidth={2}
                            className={cn(
                                "size-[18px] transition-all transition-colors",
                                copied ? "rotate-90 scale-0" : "rotate-0 scale-100",
                            )}
                        />
                        <HugeiconsIcon
                            icon={Tick02Icon}
                            strokeWidth={2}
                            className={cn(
                                "absolute size-[18px] transition-all",
                                copied ? "rotate-0 scale-100" : "-rotate-90 scale-0",
                            )}
                        />
                        <span className="sr-only">{tooltip}</span>
                    </button>
                }
            />
            <TooltipContent>{copied ? copiedTooltip : tooltip}</TooltipContent>
        </Tooltip>
    );
}

