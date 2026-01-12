import { createFileRoute } from "@tanstack/react-router";
import { BlogsTab } from "@/components/tabs/blogs-tab";

export const Route = createFileRoute("/_layout/blog")({
    component: BlogPage,
});

function BlogPage() {
    return <BlogsTab />;
}
