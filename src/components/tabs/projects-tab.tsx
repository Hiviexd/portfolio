import * as React from "react";
import { ProjectCard } from "@/components/project-card";
import { ProjectDetail } from "@/components/project-detail";
import projectsData from "../../../data/projects.json";

export type Project = {
    id: string;
    name: string;
    description: string;
    detailedDescription: string;
    link: string | null;
    repo: string | null;
    status: "Active" | "Completed" | "On Hold";
    startDate: string;
    endDate: string | null;
    stack: Array<{ name: string; color: string }>;
    highlights: string[];
};

export function ProjectsTab() {
    const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
    const projects = projectsData as Project[];

    const handleProjectClick = (project: Project) => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                setSelectedProject(project);
            });
        } else {
            setSelectedProject(project);
        }
    };

    const handleClose = () => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                setSelectedProject(null);
            });
        } else {
            setSelectedProject(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => handleProjectClick(project)}
                        isSelected={selectedProject?.id === project.id}
                    />
                ))}
            </div>

            <ProjectDetail project={selectedProject} onClose={handleClose} />
        </div>
    );
}
