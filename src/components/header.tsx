import { ThemeToggle } from "@/components/theme-toggle";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { Logo } from "@/components/logo";
import { SpotifyPresence } from "@/components/spotify-presence";

export function Header() {
    return (
        <header className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Logo size={128} />
                    <div className="flex flex-col -mb-[20px]">
                        <span className="font-semibold text-lg">
                            Hi, I'm
                            <FlipWords
                                words={["Hivie", "Rayen Attia"]}
                                duration={3000}
                                letterDelay={0.05}
                                wordDelay={0.3}
                            />
                        </span>
                        <div className="min-h-[20px]">
                            <SpotifyPresence discordId="341321481390784512" />
                        </div>
                    </div>
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
