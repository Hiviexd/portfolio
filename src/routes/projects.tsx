import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/projects")({
    component: ProjectsLayout,
});

function ProjectsLayout() {
    // This route exists only to provide a parent for /projects/$projectId
    // Direct access to /projects will show nothing (empty outlet)
    // In practice, users should use / or /projects/id
    return <Outlet />;
}
