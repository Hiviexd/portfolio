export type Project = {
    id: string;
    name: string;
    description: string;
    detailedDescription: string;
    link: string | null;
    repo: string | null;
    status: "Active" | "Completed" | "Maintainer";
    startDate: string;
    endDate: string | null;
    stack: Array<{ name: string; color: string }>;
    highlights?: string[];
};

export type Experience = {
    id: string;
    role: string;
    company: string;
    location: string;
    type: string;
    startDate: string;
    endDate: string;
    description: string;
    responsibilities: string[];
    stack?: Array<{ name: string; color: string }>;
};

export type Skill = {
    name: string;
    logo: string;
    note?: string;
    favorite?: boolean;
    libraryIcon?: boolean;
};

export type SkillCategory = {
    name: string;
    skills: Skill[];
};

export type Blog = {
    id: string;
    title: string;
    date: string;
    banner?: string;
    readTime?: string;
    content: string;
};
