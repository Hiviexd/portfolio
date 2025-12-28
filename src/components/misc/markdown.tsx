import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";

type MarkdownProps = {
    children: string;
    className?: string;
};

export function Markdown({ children, className }: MarkdownProps) {
    return (
        <div className={cn("prose prose-sm dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    // Headings
                    h1: ({ className, ...props }) => <h1 className={cn("text-foreground", className)} {...props} />,
                    h2: ({ className, ...props }) => <h2 className={cn("text-foreground", className)} {...props} />,
                    h3: ({ className, ...props }) => <h3 className={cn("text-foreground", className)} {...props} />,
                    h4: ({ className, ...props }) => <h4 className={cn("text-foreground", className)} {...props} />,
                    h5: ({ className, ...props }) => <h5 className={cn("text-foreground", className)} {...props} />,
                    h6: ({ className, ...props }) => <h6 className={cn("text-foreground", className)} {...props} />,
                    // Paragraph
                    p: ({ className, ...props }) => <p className={cn("text-foreground", className)} {...props} />,
                    // Links
                    a: ({ className, ...props }) => (
                        <a className={cn("text-primary underline hover:text-primary/80", className)} {...props} />
                    ),
                    // Lists
                    ul: ({ className, ...props }) => <ul className={cn("text-foreground", className)} {...props} />,
                    ol: ({ className, ...props }) => <ol className={cn("text-foreground", className)} {...props} />,
                    li: ({ className, ...props }) => <li className={cn("text-foreground", className)} {...props} />,
                    // Code
                    code: ({ className, ...props }) => (
                        <code
                            className={cn(
                                "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-foreground",
                                className,
                            )}
                            {...props}
                        />
                    ),
                    // Blockquote
                    blockquote: ({ className, ...props }) => (
                        <blockquote
                            className={cn("border-l-4 border-border pl-4 italic text-muted-foreground", className)}
                            {...props}
                        />
                    ),
                    // Horizontal rule
                    hr: ({ className, ...props }) => <hr className={cn("border-border", className)} {...props} />,
                    // Table
                    table: ({ className, ...props }) => (
                        <table className={cn("w-full border-collapse border border-border", className)} {...props} />
                    ),
                    th: ({ className, ...props }) => (
                        <th
                            className={cn("border border-border bg-muted px-4 py-2 text-left font-semibold", className)}
                            {...props}
                        />
                    ),
                    td: ({ className, ...props }) => (
                        <td className={cn("border border-border px-4 py-2", className)} {...props} />
                    ),
                }}>
                {children}
            </ReactMarkdown>
        </div>
    );
}
