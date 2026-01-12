import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Github01Icon,
    Linkedin01Icon,
    NewTwitterIcon,
    Mail01Icon,
    DocumentAttachmentIcon,
    DiscordIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/misc/icon";
import { CopyActionIcon } from "@/components/ui/copy-action-icon";
import { cn } from "@/lib/utils";
import socialsData from "../../../data/socials.json";
import metadata from "../../../data/metadata.json";

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
    file: DocumentAttachmentIcon,
};

export function SocialLinks() {
    const socials = socialsData as SocialLink[];

    return (
        <div className="flex items-center gap-1">
            {socials.map((link) => {
                const IconComponent = iconMap[link.icon];

                return (
                    <Tooltip key={link.name}>
                        <TooltipTrigger
                            render={
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "inline-flex items-center justify-center size-8 rounded-lg border border-transparent hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    )}
                                >
                                    {IconComponent ? (
                                        <HugeiconsIcon icon={IconComponent} strokeWidth={2} className="size-[18px]" />
                                    ) : (
                                        <Icon src={link.icon} size={18} />
                                    )}
                                    <span className="sr-only">{link.name}</span>
                                </a>
                            }
                        />
                        <TooltipContent>{link.name}</TooltipContent>
                    </Tooltip>
                );
            })}

            {/* Discord copy button */}
            <CopyActionIcon icon={DiscordIcon} value={metadata.discordUsername} tooltip="Copy Discord username" />
        </div>
    );
}
