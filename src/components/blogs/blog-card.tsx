import type { Blog } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock01Icon } from "@hugeicons/core-free-icons";

type BlogCardProps = {
    blog: Blog;
    onClick: () => void;
};

export function BlogCard({ blog, onClick }: BlogCardProps) {
    const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    return (
        <button
            onClick={onClick}
            className="group relative flex flex-row items-center gap-4 w-full rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer text-left"
        >
            {/* Banner thumbnail (if available) */}
            {blog.banner && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img src={blog.banner} alt={blog.title} className="w-full h-full object-cover" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground transition-colors truncate">{blog.title}</h3>

                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <HugeiconsIcon icon={Calendar03Icon} className="size-3.5" strokeWidth={2} />
                        <span>{formattedDate}</span>
                    </div>
                    {blog.readTime && (
                        <div className="flex items-center gap-1">
                            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" strokeWidth={2} />
                            <span>{blog.readTime}</span>
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
}
