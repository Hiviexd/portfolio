import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type MarkdownImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    title?: string;
    /** When true, caption is shown under the image and tooltip is not rendered */
    standalone?: boolean;
};

export function MarkdownImage({ title, standalone, ...imgProps }: MarkdownImageProps) {
    const img = <img {...imgProps} />;

    return (
        <span className="markdown-image-wrapper">
            {title && !standalone ? (
                <Tooltip>
                    <TooltipTrigger render={img} />
                    <TooltipContent sideOffset={0} className="-translate-y-2">{title}</TooltipContent>
                </Tooltip>
            ) : (
                img
            )}
            {title && <span className="markdown-image-caption">{title}</span>}
        </span>
    );
}
