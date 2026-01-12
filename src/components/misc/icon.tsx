import { cn } from "@/lib/utils";

type IconProps = {
    src: string;
    size?: number | string;
    className?: string;
};

export function Icon({ src, size = 36, className }: IconProps) {
    const sizeValue = typeof size === "number" ? `${size}px` : size;

    return (
        <div
            className={cn("inline-flex items-center justify-center", className)}
            style={{ width: sizeValue, height: sizeValue }}>
            <img
                src={src}
                alt={`icon-${src}`}
                className="w-full h-full object-contain [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)] transition-[filter]"
            />
        </div>
    );
}
