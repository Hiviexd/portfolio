import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/ui/code-block";
import "highlight.js/styles/stackoverflow-dark.min.css";
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
                rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true }]]}
                components={{
                    a: (props) => (
                        <a target="_blank" rel="noopener noreferrer" {...props} />
                    ),
                    pre: (props) => <CodeBlock {...props} />,
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
