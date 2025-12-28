import { createFileRoute } from "@tanstack/react-router";
import { ExperienceTab } from "@/components/tabs/experience-tab";

export const Route = createFileRoute("/_layout/experience")({
    component: ExperiencePage,
});

function ExperiencePage() {
    return <ExperienceTab />;
}
