import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogsTab, blogs } from "@/components/tabs/blogs-tab";

export const Route = createFileRoute("/_layout/blog/$blogId")({
    component: BlogDetailPage,
    loader: ({ params }) => {
        const blog = blogs.find((b) => b.id === params.blogId);
        if (!blog) {
            throw notFound();
        }
        return { blog };
    },
});

function BlogDetailPage() {
    const { blog } = Route.useLoaderData();

    return <BlogsTab initialBlog={blog} />;
}
