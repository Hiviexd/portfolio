import { HugeiconsIcon } from "@hugeicons/react";
import { Building03Icon, Location01Icon } from "@hugeicons/core-free-icons";

type Experience = {
    id: string;
    role: string;
    company: string;
    location: string;
    type: string;
    startDate: string;
    endDate: string;
    description: string;
    responsibilities: string[];
    stack: string[];
};

type ExperienceEntryProps = {
    experience: Experience;
    isLast: boolean;
};

export function ExperienceEntry({ experience: exp, isLast }: ExperienceEntryProps) {
    return (
        <div className="relative pl-8 pb-8 last:pb-0">
            {/* Timeline line */}
            {!isLast && <div className="absolute left-[11px] top-[28px] bottom-0 w-px bg-border" />}

            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 size-6 rounded-full border-2 border-border bg-background flex items-center justify-center">
                <div className="size-2 rounded-full bg-foreground" />
            </div>

            {/* Content */}
            <div className="space-y-3">
                {/* Header */}
                <div>
                    <h3 className="font-medium text-foreground">{exp.role}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Building03Icon} className="size-3.5" strokeWidth={2} />
                            {exp.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <HugeiconsIcon icon={Location01Icon} className="size-3.5" strokeWidth={2} />
                            {exp.location}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {exp.type}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                            {exp.startDate} — {exp.endDate}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">{exp.description}</p>

                {/* Responsibilities */}
                <ul className="space-y-1.5 text-sm">
                    {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="mt-2 size-1 rounded-full bg-muted-foreground/50 shrink-0" />
                            <span className="text-muted-foreground">{resp}</span>
                        </li>
                    ))}
                </ul>

                {/* Tech Stack */}
                {exp.stack && (
                    <div className="flex flex-wrap gap-1.5">
                        {exp.stack.map((tech) => (
                            <span key={tech} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
