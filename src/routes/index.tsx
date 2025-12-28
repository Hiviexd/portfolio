import { createFileRoute } from "@tanstack/react-router";
import { ProjectsTab } from "@/components/tabs/projects-tab";
import { PortfolioLayout } from "@/components/portfolio-layout";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    return (
        <PortfolioLayout activeTab="projects">
            <ProjectsTab />
        </PortfolioLayout>
    );
}
