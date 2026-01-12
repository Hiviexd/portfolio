import { parseAsString, parseAsStringLiteral, createLoader, Options } from "nuqs";

// Tab values - only used for explicit tabs (experience, skills)
// projects tab is default or when ?p= is present
// blogs tab is when ?b= is present
export const tabValues = ["projects", "experience", "skills", "blogs"] as const;

export type TabValue = (typeof tabValues)[number];

// Query param parsers
export const searchParamsParsers = {
    t: parseAsStringLiteral(["experience", "skills", "blogs"]),
    p: parseAsString,
    b: parseAsString,
};

// Default options for all params - shallow:false needed for TanStack Router
export const defaultOptions: Options = {
    history: "replace",
    shallow: false,
};

// Server-side loader for SSR (TanStack Start)
export const loadSearchParams = createLoader(searchParamsParsers);

// Helper to derive active tab from search params
export function getActiveTab(params: {
    t: "experience" | "skills" | "blogs" | null;
    p: string | null;
    b: string | null;
}): TabValue {
    // Blog ID implies blogs tab
    if (params.b) return "blogs";
    // Project ID implies projects tab
    if (params.p) return "projects";
    // Explicit tab param
    if (params.t) return params.t;
    // Default to projects
    return "projects";
}
