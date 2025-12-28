import type { Project } from "@/components/tabs/projects-tab";
import { ProjectStatus } from "@/components/project-status";

type ProjectCardProps = {
    project: Project;
    onClick: () => void;
    isSelected: boolean;
};

export function ProjectCard({ project, onClick, isSelected }: ProjectCardProps) {
    return (
        <button
            onClick={onClick}
            className="group relative text-left w-full rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            style={{
                viewTransitionName: isSelected ? `project-${project.id}` : undefined,
            }}>
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-foreground">{project.name}</h3>
            </div>

            <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{project.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                {project.stack.slice(0, 4).map((tech) => (
                    <div key={tech.name} className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ backgroundColor: tech.color }} />
                        <span className="text-xs text-muted-foreground">{tech.name}</span>
                    </div>
                ))}
                {project.stack.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{project.stack.length - 4}</span>
                )}
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 right-4">
                <ProjectStatus status={project.status} />
            </div>
        </button>
    );
}
