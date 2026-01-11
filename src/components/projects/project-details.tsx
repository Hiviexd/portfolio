import { useState, useEffect } from "react";
import type { Project } from "@/types";
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

function formatDate(dateStr: string) {
    const [year, month] = dateStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProjectDetails({ project, onClose }: ProjectDetailProps) {
    // Keep displayed project in state so we can show it during close animation
    const [displayedProject, setDisplayedProject] = useState<Project | null>(project);
    const [isOpen, setIsOpen] = useState(!!project);

    // Sync when a new project comes in (opening)
    useEffect(() => {
        if (project) {
            setDisplayedProject(project);
            setIsOpen(true);
        }
    }, [project]);

    const handleOpenChange = (open: boolean) => {
        if (!open && displayedProject) {
            setIsOpen(false); // Start close animation
            // Delay navigation until animation completes
            setTimeout(() => {
                setDisplayedProject(null);
                onClose();
            }, 150);
        }
    };

    if (!displayedProject) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div>
                            <DialogTitle className="text-lg">{displayedProject.name}</DialogTitle>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" strokeWidth={2} />
                                <span>
                                    {formatDate(displayedProject.startDate)} —{" "}
                                    {displayedProject.endDate ? formatDate(displayedProject.endDate) : "Present"}
                                </span>
                                <span className="ml-1">
                                    <ProjectStatus status={displayedProject.status} />
                                </span>
                            </div>
                        </div>
                    </div>
                    <DialogDescription className="mt-3 text-sm leading-relaxed">
                        <Markdown className="text-primary">{displayedProject.detailedDescription}</Markdown>
                    </DialogDescription>
                </DialogHeader>

                {/* Highlights */}
                {displayedProject.highlights && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Highlights
                        </h4>
                        <ul className="space-y-1.5">
                            {displayedProject.highlights.map((highlight, index) => (
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
                        {displayedProject.stack.map((tech) => (
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
                {(displayedProject.link || displayedProject.repo) && (
                    <div className="flex items-center gap-2 pt-2">
                        {displayedProject.link && (
                            <a
                                href={displayedProject.link}
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
                        {displayedProject.repo && (
                            <a
                                href={displayedProject.repo}
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
