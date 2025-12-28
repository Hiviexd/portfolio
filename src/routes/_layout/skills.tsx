import { createFileRoute } from "@tanstack/react-router";
import { SkillsTab } from "@/components/tabs/skills-tab";

export const Route = createFileRoute("/_layout/skills")({
    component: SkillsPage,
});

function SkillsPage() {
    return <SkillsTab />;
}
