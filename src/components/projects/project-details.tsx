import { useRef, useState, useLayoutEffect } from "react";
import type { Project } from "@/components/tabs/projects-tab";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Github01Icon, Calendar03Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { ProjectStatus } from "@/components/projects/project-status";
import { cn } from "@/lib/utils";
import { Markdown } from "@/components/misc/markdown";

type ProjectDetailProps = {
    project: Project | null;
    onClose: () => void;
};

export function ProjectDetails({ project, onClose }: ProjectDetailProps) {
    const [displayProject, setDisplayProject] = useState<Project | null>(project);
    const [isOpen, setIsOpen] = useState(!!project);
    const closingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Sync state when project prop changes
    useLayoutEffect(() => {
        if (project) {
            setDisplayProject(project);
            setIsOpen(true);
            // Clear any pending close
            if (closingTimeoutRef.current) {
                clearTimeout(closingTimeoutRef.current);
                closingTimeoutRef.current = null;
            }
        }
    }, [project]);

    const handleOpenChange = (open: boolean) => {
        if (!open && displayProject) {
            // Start closing animation
            setIsOpen(false);
            // Clear any existing timeout
            if (closingTimeoutRef.current) {
                clearTimeout(closingTimeoutRef.current);
            }
            // Delay navigation until after animation completes (100ms duration + buffer)
            closingTimeoutRef.current = setTimeout(() => {
                setDisplayProject(null);
                onClose();
            }, 150);
        }
    };

    if (!displayProject) return null;

    const formatDate = (dateStr: string) => {
        const [year, month] = dateStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div>
                            <DialogTitle className="text-lg">{displayProject.name}</DialogTitle>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" strokeWidth={2} />
                                <span>
                                    {formatDate(displayProject.startDate)} —{" "}
                                    {displayProject.endDate ? formatDate(displayProject.endDate) : "Present"}
                                </span>
                                <span className="ml-1">
                                    <ProjectStatus status={displayProject.status} />
                                </span>
                            </div>
                        </div>
                    </div>
                    <DialogDescription className="mt-3 text-sm leading-relaxed">
                        <Markdown className="text-primary">{displayProject.detailedDescription}</Markdown>
                    </DialogDescription>
                </DialogHeader>

                {/* Highlights */}
                {displayProject.highlights && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Highlights
                        </h4>
                        <ul className="space-y-1.5">
                            {displayProject.highlights.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <HugeiconsIcon
                                        icon={CheckmarkCircle02Icon}
                                        className="size-4 mt-0.5 text-emerald-500 shrink-0"
                                        strokeWidth={2}
                                    />
                                    <span>{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Tech Stack */}
                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {displayProject.stack.map((tech) => (
                            <div
                                key={tech.name}
                                className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1">
                                <span className="size-2 rounded-full" style={{ backgroundColor: tech.color }} />
                                <span className="text-xs">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Links */}
                {(displayProject.link || displayProject.repo) && (
                    <div className="flex items-center gap-2 pt-2">
                        {displayProject.link && (
                            <a
                                href={displayProject.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    buttonVariants({ variant: "default", size: "sm" }),
                                    "flex items-center gap-1.5",
                                )}>
                                <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} className="size-3.5" />
                                Website
                            </a>
                        )}
                        {displayProject.repo && (
                            <a
                                href={displayProject.repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    buttonVariants({ variant: "outline", size: "sm" }),
                                    "flex items-center gap-1.5",
                                )}>
                                <HugeiconsIcon icon={Github01Icon} strokeWidth={2} className="size-3.5" />
                                Source Code
                            </a>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
