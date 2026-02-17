import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

// When TSS_PRERENDERING is set, TanStack Start runs vite.preview() for prerender. Nitro's
// preview plugin expects standalone Nitro build info and would throw — skip Nitro in that case.
const isPrerendering = process.env.TSS_PRERENDERING === "true";

const config = defineConfig({
    // For GitHub Pages project site (e.g. user.github.io/repo), set BASE=/repo/ in the workflow
    base: process.env.BASE ?? "/",
    // So TanStack Start's preview (used during prerender) finds the Nitro-built server bundle
    environments: {
        ssr: {
            build: {
                outDir: "node_modules/.nitro/vite/services/ssr",
            },
        },
    },
    plugins: [
        devtools(),
        ...(isPrerendering ? [] : [nitro()]),
        // this is the plugin that enables path aliases
        viteTsConfigPaths({
            projects: ["./tsconfig.json"],
        }),
        tailwindcss(),
        tanstackStart({
            prerender: {
                enabled: true,
                autoSubfolderIndex: true,
                autoStaticPathsDiscovery: true,
                crawlLinks: true,
                filter: ({ path }) => !path.startsWith("/resume.pdf"),
            },
        }),
        viteReact(),
    ],
});

export default config;
