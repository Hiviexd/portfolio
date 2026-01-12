import type { Blog } from "@/types";

/**
 * Parse YAML frontmatter from a markdown string.
 * Browser-compatible alternative to gray-matter.
 */
function parseYamlFrontmatter(content: string): { data: Record<string, string>; content: string } {
    const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { data: {}, content };
    }

    const [, yamlBlock, body] = match;
    const data: Record<string, string> = {};

    // Simple YAML key-value parsing (supports basic string values)
    yamlBlock.split(/\r?\n/).forEach((line) => {
        const colonIndex = line.indexOf(":");
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            const value = line.slice(colonIndex + 1).trim();
            // Remove surrounding quotes if present
            data[key] = value.replace(/^["']|["']$/g, "");
        }
    });

    return { data, content: body.trim() };
}

export function parseBlog(filename: string, rawContent: string): Blog {
    const { data, content } = parseYamlFrontmatter(rawContent);
    return {
        id: filename.replace(/\.md$/, ""),
        title: data.title ?? "Untitled",
        date: data.date ?? new Date().toISOString().split("T")[0],
        banner: data.banner,
        readTime: data.readTime,
        content,
    };
}
