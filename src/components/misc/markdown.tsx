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
                    // Only override what actually needs customization
                    a: ({ className, ...props }) => (
                        <a
                            className={cn("text-primary underline hover:text-primary/80", className)}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),
                    code: ({ className, ...props }) => (
                        <code
                            className={cn("rounded bg-muted px-1.5 py-0.5 font-mono text-sm", className)}
                            {...props}
                        />
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
