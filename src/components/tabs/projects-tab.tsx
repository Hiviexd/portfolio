import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetails } from "@/components/projects/project-details";
import { useQueryState } from "nuqs";
import projectsData from "../../../data/projects.json";
import type { Project } from "@/types";

export function ProjectsTab() {
    const projects = projectsData as Project[];
    
    // Use nuqs for project selection - ?p= param
    const [projectId, setProjectId] = useQueryState("p", {
        history: "replace",
        shallow: false,
    });

    const selectedProject = projects.find((p) => p.id === projectId) || null;

    const handleProjectClick = (project: Project) => {
        setProjectId(project.id);
    };

    const handleClose = () => {
        setProjectId(null);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 items-start">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
                ))}
            </div>

            <ProjectDetails project={selectedProject} onClose={handleClose} />
        </div>
    );
}
