import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";
import "./markdown.css";

type MarkdownProps = {
    children: string;
    className?: string;
};

export function Markdown({ children, className }: MarkdownProps) {
    return (
        <div className={cn("markdown-text", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    // Links need target="_blank" for external links
                    a: (props) => (
                        <a target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
