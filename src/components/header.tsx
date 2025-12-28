import { ThemeToggle } from "@/components/theme-toggle";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { Logo } from "@/components/logo";

export function Header() {
    return (
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Logo size={128} />
                <span className="font-semibold text-lg">
                    Hi, I'm
                    <FlipWords words={["Hivie", "Rayen Attia"]} duration={3000} letterDelay={0.05} wordDelay={0.3} />
                </span>
            </div>
            <ThemeToggle />
        </header>
    );
}
