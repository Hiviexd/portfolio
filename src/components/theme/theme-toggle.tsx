import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun02Icon, Moon02Icon } from "@hugeicons/core-free-icons";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
            <HugeiconsIcon
                icon={Sun02Icon}
                className="size-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                strokeWidth={2}
            />
            <HugeiconsIcon
                icon={Moon02Icon}
                className="absolute size-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                strokeWidth={2}
            />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
