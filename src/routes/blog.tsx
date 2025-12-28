import { createFileRoute } from "@tanstack/react-router";
import { BlogsTab } from "@/components/tabs/blogs-tab";
import { PortfolioLayout } from "@/components/portfolio-layout";

export const Route = createFileRoute("/blog")({
    component: BlogPage,
});

function BlogPage() {
    return (
        <PortfolioLayout activeTab="blogs">
            <BlogsTab />
        </PortfolioLayout>
    );
}
