import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProjectsTab } from "@/components/tabs/projects-tab";
import { PortfolioLayout } from "@/components/portfolio-layout";
import projectsData from "../../data/projects.json";
import type { Project } from "@/components/tabs/projects-tab";

export const Route = createFileRoute("/projects/$projectId")({
    component: ProjectDetailPage,
    loader: ({ params }) => {
        const projects = projectsData as Project[];
        const project = projects.find((p) => p.id === params.projectId);
        if (!project) {
            throw notFound();
        }
        return { project };
    },
});

function ProjectDetailPage() {
    const { project } = Route.useLoaderData();

    return (
        <PortfolioLayout activeTab="projects">
            <ProjectsTab initialProject={project} />
        </PortfolioLayout>
    );
}
