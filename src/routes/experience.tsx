import { createFileRoute } from "@tanstack/react-router";
import { ExperienceTab } from "@/components/tabs/experience-tab";
import { PortfolioLayout } from "@/components/portfolio-layout";

export const Route = createFileRoute("/experience")({
    component: ExperiencePage,
});

function ExperiencePage() {
    return (
        <PortfolioLayout activeTab="experience">
            <ExperienceTab />
        </PortfolioLayout>
    );
}
