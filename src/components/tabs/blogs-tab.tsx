import { BlogCard } from "@/components/blogs/blog-card";
import { BlogContent } from "@/components/blogs/blog-content";
import { AnimatePresence, motion } from "motion/react";
import { useQueryStates, parseAsString } from "nuqs";
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

export function BlogsTab() {
    // Use nuqs for blog selection - ?b= param
    // Using useQueryStates to clear ?t= when setting ?b= (since b implies blogs tab)
    const [{ b: blogId }, setParams] = useQueryStates(
        { t: parseAsString, b: parseAsString },
        { history: "replace", shallow: false },
    );

    const selectedBlog = blogs.find((b) => b.id === blogId) || null;

    const handleBlogClick = (blog: Blog) => {
        // Clear t and set b - the b param implies blogs tab
        setParams({ t: null, b: blog.id });
    };

    const handleBack = () => {
        // Set t=blogs and clear b to return to blog listing
        setParams({ t: "blogs", b: null });
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
                    Maybe one day I'll post my yap sessions here whenever I get inspiration.
                </p>
            </div>
        );
    }

    const transition = { duration: 0.15, ease: "easeInOut" as const };

    return (
        <AnimatePresence mode="wait" initial={false}>
            {selectedBlog ? (
                <motion.div
                    key={`blog-${selectedBlog.id}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={transition}
                    className="overflow-hidden">
                    <BlogContent blog={selectedBlog} onBack={handleBack} />
                </motion.div>
            ) : (
                <motion.div
                    key="list"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={transition}
                    className="space-y-3 overflow-hidden">
                    {blogs.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} onClick={() => handleBlogClick(blog)} />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Export blogs for potential use elsewhere
export { blogs };
