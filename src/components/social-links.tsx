import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, Linkedin01Icon, NewTwitterIcon, Mail01Icon } from "@hugeicons/core-free-icons";

const socialLinks = [
    {
        name: "GitHub",
        href: "https://github.com/johndoe",
        icon: Github01Icon,
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/in/johndoe",
        icon: Linkedin01Icon,
    },
    {
        name: "X (Twitter)",
        href: "https://x.com/johndoe",
        icon: NewTwitterIcon,
    },
    {
        name: "Email",
        href: "mailto:hello@johndoe.dev",
        icon: Mail01Icon,
    },
];

export function SocialLinks() {
    return (
        <div className="flex items-center gap-1">
            {socialLinks.map((link) => (
                <Tooltip key={link.name}>
                    <TooltipTrigger
                        render={
                            <Button variant="ghost" size="icon" asChild>
                                <a href={link.href} target="_blank" rel="noopener noreferrer">
                                    <HugeiconsIcon icon={link.icon} strokeWidth={2} className="size-[18px]" />
                                    <span className="sr-only">{link.name}</span>
                                </a>
                            </Button>
                        }
                    />
                    <TooltipContent>{link.name}</TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
}
