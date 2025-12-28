import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, Linkedin01Icon, NewTwitterIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import socialsData from "../../data/socials.json";

type SocialLink = {
    name: string;
    href: string;
    icon: string;
};

// Map icon string identifiers to actual icon components
const iconMap: Record<string, typeof Github01Icon> = {
    github: Github01Icon,
    linkedin: Linkedin01Icon,
    twitter: NewTwitterIcon,
    email: Mail01Icon,
};

export function SocialLinks() {
    const socials = socialsData as SocialLink[];

    return (
        <div className="flex items-center gap-1">
            {socials.map((link) => {
                const IconComponent = iconMap[link.icon];
                if (!IconComponent) return null;

                return (
                    <Tooltip key={link.name}>
                        <TooltipTrigger
                            render={
                                <Button variant="ghost" size="icon">
                                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                                        <HugeiconsIcon icon={IconComponent} strokeWidth={2} className="size-[18px]" />
                                        <span className="sr-only">{link.name}</span>
                                    </a>
                                </Button>
                            }
                        />
                        <TooltipContent>{link.name}</TooltipContent>
                    </Tooltip>
                );
            })}
        </div>
    );
}
