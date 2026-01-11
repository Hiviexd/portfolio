import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetails } from "@/components/projects/project-details";
import { useNavigate, useRouter } from "@tanstack/react-router";
import projectsData from "../../../data/projects.json";
import type { Project } from "@/types";

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
        // Save scroll position before navigation
        const scrollY = window.scrollY;
        sessionStorage.setItem("project-dialog-scroll", scrollY.toString());

        navigate({
            to: `/projects/${project.id}`,
            replace: true,
            resetScroll: false,
        });
    };

    const handleClose = () => {
        // Restore scroll position after closing
        const savedScroll = sessionStorage.getItem("project-dialog-scroll");
        const scrollY = savedScroll ? parseInt(savedScroll, 10) : 0;

        navigate({
            to: "/",
            replace: true,
            resetScroll: false,
        });

        // Restore scroll position after navigation
        requestAnimationFrame(() => {
            window.scrollTo(0, scrollY);
        });
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
