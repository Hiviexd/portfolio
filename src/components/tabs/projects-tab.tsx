import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetails } from "@/components/projects/project-details";
import { useQueryState } from "nuqs";
import projectsData from "../../../data/projects.json";
import socialsData from "../../../data/socials.json";
import type { Project } from "@/types";

const githubHref = (socialsData as { name: string; href: string }[]).find((link) => link.name === "GitHub")?.href;

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

            {githubHref && (
                <p className="text-center text-sm text-muted-foreground">
                    and many more on my{" "}
                    <a
                        href={githubHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground text-sm underline-offset-4 link-fancy"
                    >
                        GitHub
                    </a>
                </p>
            )}

            <ProjectDetails project={selectedProject} onClose={handleClose} />
        </div>
    );
}
