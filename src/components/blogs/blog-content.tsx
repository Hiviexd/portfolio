import type { Blog } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Clock01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Markdown } from "@/components/misc/markdown";
import { Button } from "@/components/ui/button";

type BlogContentProps = {
    blog: Blog;
    onBack: () => void;
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function BlogContent({ blog, onBack }: BlogContentProps) {
    return (
        <div className="space-y-6">
            {/* Back button */}
            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
                <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 mr-1.5" strokeWidth={2} />
                Back to blogs
            </Button>

            {/* Banner image */}
            {blog.banner && (
                <div className="rounded-xl overflow-hidden">
                    <img
                        src={blog.banner}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                    />
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">{blog.title}</h1>
                <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Calendar03Icon} className="size-4" strokeWidth={2} />
                        <span>{formatDate(blog.date)}</span>
                    </div>
                    {blog.readTime && (
                        <div className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Clock01Icon} className="size-4" strokeWidth={2} />
                            <span>{blog.readTime}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{blog.content}</Markdown>
            </div>
        </div>
    );
}
