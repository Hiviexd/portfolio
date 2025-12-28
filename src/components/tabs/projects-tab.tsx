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
    status: "Active" | "Completed" | "Maintainer";
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
        // Save scroll position before navigation
        const scrollY = window.scrollY;
        sessionStorage.setItem("project-dialog-scroll", scrollY.toString());

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate({
                    to: `/projects/${project.id}`,
                    replace: true,
                    resetScroll: false,
                });
            });
        } else {
            navigate({
                to: `/projects/${project.id}`,
                replace: true,
                resetScroll: false,
            });
        }
    };

    const handleClose = () => {
        // Restore scroll position after closing
        const savedScroll = sessionStorage.getItem("project-dialog-scroll");
        const scrollY = savedScroll ? parseInt(savedScroll, 10) : 0;

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                navigate({
                    to: "/",
                    replace: true,
                    resetScroll: false,
                });
                // Restore scroll position after navigation
                requestAnimationFrame(() => {
                    window.scrollTo(0, scrollY);
                });
            });
        } else {
            navigate({
                to: "/",
                replace: true,
                resetScroll: false,
            });
            // Restore scroll position after navigation
            requestAnimationFrame(() => {
                window.scrollTo(0, scrollY);
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 items-start">
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
