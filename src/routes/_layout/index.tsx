import { createFileRoute } from "@tanstack/react-router";
import { ProjectsTab } from "@/components/tabs/projects-tab";

export const Route = createFileRoute("/_layout/")({
    component: HomePage,
});

function HomePage() {
    return <ProjectsTab />;
}
