import { ProjectCard } from "@/components/project-card";
import { ProjectDetail } from "@/components/project-detail";
import { useNavigate, useRouter } from "@tanstack/react-router";
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

type ProjectsTabProps = {
    initialProject?: Project;
};

export function ProjectsTab({ initialProject }: ProjectsTabProps) {
    const navigate = useNavigate();
    const router = useRouter();
    const projects = projectsData as Project[];

    // Get project from route params if on detail page
    const currentPath = router.state.location.pathname;
    const projectIdFromRoute = currentPath.startsWith("/projects/") ? currentPath.split("/projects/")[1] : null;

    const selectedProject = initialProject || projects.find((p) => p.id === projectIdFromRoute) || null;

    const handleProjectClick = (project: Project) => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate({ to: `/projects/${project.id}` });
            });
        } else {
            navigate({ to: `/projects/${project.id}` });
        }
    };

    const handleClose = () => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate({ to: "/" });
            });
        } else {
            navigate({ to: "/" });
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
