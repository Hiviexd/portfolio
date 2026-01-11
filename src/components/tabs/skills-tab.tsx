import skillsData from "../../../data/skills.json";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { GithubIcon, ShadcnIcon } from "@hugeicons/core-free-icons";
import type { Skill, SkillCategory } from "@/types";
import { cn } from "@/lib/utils";

export function SkillsTab() {
    const { categories } = skillsData as { categories: SkillCategory[] };

    const iconMap: Record<string, IconSvgElement> = {
        github: GithubIcon,
        shadcn: ShadcnIcon,
    };

    return (
        <div className="space-y-6">
            {categories.map((category) => (
                <div key={category.name} className="space-y-3">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {category.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {category.skills.map((skill: Skill) => (
                            <div
                                key={skill.name}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50",
                                    skill.favorite ? "border-teal-400 dark:border-teal-500/80" : "border-border",
                                )}>
                                {skill.libraryIcon && iconMap[skill.logo] ? (
                                    <HugeiconsIcon icon={iconMap[skill.logo]} strokeWidth={2} className="size-5" />
                                ) : (
                                    <img src={`/icons/${skill.logo}`} alt={skill.name} className="size-5" />
                                )}
                                <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm truncate">{skill.name}</div>
                                    {skill.note && (
                                        <div className="text-xs text-muted-foreground truncate">{skill.note}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
