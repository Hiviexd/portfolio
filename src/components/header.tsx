import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
    return (
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Logo placeholder */}
                <div className="size-9 rounded-lg bg-foreground flex items-center justify-center">
                    <span className="text-background font-bold text-sm">JD</span>
                </div>
                <span className="font-semibold text-lg">John Doe</span>
            </div>
            <ThemeToggle />
        </header>
    );
}
