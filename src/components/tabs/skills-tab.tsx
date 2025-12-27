import skillsData from "../../../data/skills.json";

type Skill = {
    name: string;
    logo: string;
    note?: string;
};

type SkillCategory = {
    name: string;
    skills: Skill[];
};

// Simple icon mapping - in production you'd use actual icons
const skillIcons: Record<string, string> = {
    react: "⚛️",
    typescript: "🔷",
    nextjs: "▲",
    vue: "💚",
    tailwind: "🎨",
    html: "📄",
    nodejs: "💚",
    python: "🐍",
    go: "🔵",
    postgresql: "🐘",
    mongodb: "🍃",
    redis: "🔴",
    git: "📦",
    docker: "🐳",
    aws: "☁️",
    vercel: "▲",
    github: "🐙",
    linux: "🐧",
    figma: "🎨",
    api: "🔌",
    graphql: "💜",
    testing: "🧪",
};

export function SkillsTab() {
    const { categories } = skillsData as { categories: SkillCategory[] };

    return (
        <div className="space-y-6">
            {categories.map((category) => (
                <div key={category.name} className="space-y-3">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {category.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {category.skills.map((skill) => (
                            <div
                                key={skill.name}
                                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50"
                            >
                                <span className="text-lg" role="img" aria-hidden>
                                    {skillIcons[skill.logo] || "💻"}
                                </span>
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
