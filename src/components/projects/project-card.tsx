import type { Project } from "@/types";
import { ProjectStatus } from "@/components/projects/project-status";

type ProjectCardProps = {
    project: Project;
    onClick: () => void;
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
    return (
        <button
            onClick={onClick}
            className="group relative flex flex-col text-left w-full h-full rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer">
            <div className="flex items-start justify-between gap-2 min-h-[1.5rem]">
                <h3 className="font-medium text-foreground transition-colors">{project.name}</h3>
            </div>

            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex-1">{project.description}</p>

            <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                {project.stack.slice(0, 7).map((tech) => (
                    <div key={tech.name} className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ backgroundColor: tech.color }} />
                        <span className="text-xs text-muted-foreground">{tech.name}</span>
                    </div>
                ))}
                {project.stack.length > 7 && (
                    <span className="text-xs text-muted-foreground">+{project.stack.length - 7}</span>
                )}
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 right-4">
                <ProjectStatus status={project.status} />
            </div>
        </button>
    );
}
