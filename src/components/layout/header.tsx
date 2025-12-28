import { ThemeToggle } from "@/components/theme/theme-toggle";
import { FlipWords } from "@/components/ui/shadcn-io/flip-words";
import { Icon } from "@/components/misc/icon";
import { SpotifyPresence } from "@/components/misc/spotify-presence";

export function Header() {
    return (
        <header className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Icon src="/logo.svg" size={128} className="-ml-6" />
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
                            <SpotifyPresence />
                        </div>
                    </div>
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
