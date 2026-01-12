import { BlogCard } from "@/components/blogs/blog-card";
import { BlogContent } from "@/components/blogs/blog-content";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { parseBlog } from "@/lib/parse-blog";
import type { Blog } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon } from "@hugeicons/core-free-icons";

// Import all blog markdown files at build time
const blogModules = import.meta.glob<string>("../../../data/blogs/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
});

// Parse all blogs
const blogs: Blog[] = Object.entries(blogModules)
    .map(([path, content]) => {
        const filename = path.split("/").pop() ?? "";
        return parseBlog(filename, content);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

type BlogsTabProps = {
    initialBlog?: Blog;
};

export function BlogsTab({ initialBlog }: BlogsTabProps) {
    const navigate = useNavigate();
    // Use useRouterState for reactive pathname (re-renders on route change)
    const currentPath = useRouterState({ select: (s) => s.location.pathname });

    // Get blog from route params if on detail page
    const blogIdFromRoute = currentPath.startsWith("/blog/") ? currentPath.split("/blog/")[1] : null;

    const selectedBlog = initialBlog || blogs.find((b) => b.id === blogIdFromRoute) || null;

    const handleBlogClick = (blog: Blog) => {
        navigate({
            to: `/blog/${blog.id}`,
            resetScroll: true,
        });
    };

    const handleBack = () => {
        navigate({
            to: "/blog",
            resetScroll: true,
        });
    };

    // Show empty state if no blogs
    if (blogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <HugeiconsIcon icon={Edit02Icon} className="size-8 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium text-foreground">Nothing yet..</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                    Maybe one day I'll post my yapp sessions here whenever I get inspiration.
                </p>
            </div>
        );
    }

    // Show blog content if a blog is selected
    if (selectedBlog) {
        return <BlogContent blog={selectedBlog} onBack={handleBack} />;
    }

    // Show blog listing
    return (
        <div className="space-y-3">
            {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} onClick={() => handleBlogClick(blog)} />
            ))}
        </div>
    );
}

// Export blogs for route loader
export { blogs };
