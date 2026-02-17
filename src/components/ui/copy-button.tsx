import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type CopyButtonBase = {
    icon: IconSvgElement;
    tooltip?: string;
    copiedTooltip?: string;
    className?: string;
};

type CopyButtonWithValue = CopyButtonBase & { value: string; getValue?: never };
type CopyButtonWithGetter = CopyButtonBase & { getValue: () => string | Promise<string>; value?: never };

export type CopyButtonProps = CopyButtonWithValue | CopyButtonWithGetter;

export function CopyButton({ icon, tooltip = "Copy", copiedTooltip = "Copied!", className, ...rest }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const text = "value" in rest ? rest.value : await rest.getValue();
        if (text) {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <button
                        type="button"
                        onClick={handleCopy}
                        className={cn(
                            "relative inline-flex items-center justify-center size-8 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                            copied
                                ? "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                                : "border-transparent hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
                            className,
                        )}
                        aria-label={copied ? "Copied" : tooltip}>
                        <span className="relative inline-flex size-[18px] items-center justify-center">
                            <AnimatePresence mode="wait" initial={false}>
                                {!copied ? (
                                    <motion.span
                                        key="icon"
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{
                                            scale: 0.7,
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.12,
                                            ease: [0.32, 0.72, 0, 1],
                                        }}>
                                        <HugeiconsIcon icon={icon} strokeWidth={2} className="size-[18px]" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="tick"
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{
                                            scale: 0.7,
                                            opacity: 0,
                                            transition: {
                                                duration: 0.06,
                                                ease: [0.32, 0.72, 0, 1],
                                            },
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 420,
                                            damping: 22,
                                        }}>
                                        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-[18px]" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </span>
                        <span className="sr-only">{copied ? "Copied" : tooltip}</span>
                    </button>
                }
            />
            <TooltipContent>{copied ? copiedTooltip : tooltip}</TooltipContent>
        </Tooltip>
    );
}
