import { createFileRoute } from "@tanstack/react-router";
import { SkillsTab } from "@/components/tabs/skills-tab";
import { PortfolioLayout } from "@/components/portfolio-layout";

export const Route = createFileRoute("/skills")({
    component: SkillsPage,
});

function SkillsPage() {
    return (
        <PortfolioLayout activeTab="skills">
            <SkillsTab />
        </PortfolioLayout>
    );
}
