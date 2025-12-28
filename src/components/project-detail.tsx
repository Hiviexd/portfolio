import type { Project } from "@/components/tabs/projects-tab";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon, Github01Icon, Calendar03Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type ProjectDetailProps = {
    project: Project | null;
    onClose: () => void;
};

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
    if (!project) return null;

    const formatDate = (dateStr: string) => {
        const [year, month] = dateStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    return (
        <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="sm:max-w-lg"
                style={{
                    viewTransitionName: `project-${project.id}`,
                }}>
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div>
                            <DialogTitle className="text-lg">{project.name}</DialogTitle>
                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" strokeWidth={2} />
                                <span>
                                    {formatDate(project.startDate)} —{" "}
                                    {project.endDate ? formatDate(project.endDate) : "Present"}
                                </span>
                                <span
                                    className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                        project.status === "Active"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : project.status === "Completed"
                                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <DialogDescription className="mt-3 text-sm leading-relaxed">
                        {project.detailedDescription}
                    </DialogDescription>
                </DialogHeader>

                {/* Highlights */}
                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Highlights</h4>
                    <ul className="space-y-1.5">
                        {project.highlights.map((highlight, index) => (
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

                {/* Tech Stack */}
                <div className="space-y-2">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
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
                {(project.link || project.repo) && (
                    <div className="flex items-center gap-2 pt-2">
                        {project.link && (
                            <a
                                href={project.link}
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
                        {project.repo && (
                            <a
                                href={project.repo}
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
