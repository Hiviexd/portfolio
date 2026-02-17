import { useRef } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { Copy01Icon } from "@hugeicons/core-free-icons";

export function CodeBlock({ children, ...props }: React.ComponentPropsWithoutRef<"pre">) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={wrapperRef} className="markdown-code-block-wrapper">
            <CopyButton
                icon={Copy01Icon}
                tooltip="Copy code"
                getValue={() => wrapperRef.current?.querySelector("code")?.textContent ?? ""}
                className="markdown-code-block-copy"
            />
            <pre {...props}>{children}</pre>
        </div>
    );
}
