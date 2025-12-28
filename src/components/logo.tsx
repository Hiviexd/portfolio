import { cn } from "@/lib/utils";

type LogoProps = {
    size?: number | string;
    className?: string;
};

export function Logo({ size = 36, className }: LogoProps) {
    const sizeValue = typeof size === "number" ? `${size}px` : size;

    return (
        <div
            className={cn("inline-flex items-center justify-center -ml-6", className)}
            style={{ width: sizeValue, height: sizeValue }}>
            <img
                src="/logo.svg"
                alt="Logo"
                className="w-full h-full object-contain [filter:brightness(0)] dark:[filter:brightness(0)_invert(1)]"
            />
        </div>
    );
}
