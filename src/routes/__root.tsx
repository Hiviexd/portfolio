import { useState, useEffect } from "react";
import { HeadContent, Scripts, createRootRoute, Outlet } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { BackgroundBeamsWithCollision } from "@/components/ui/shadcn-io/background-beams-with-collision";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: "utf-8",
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1",
            },
            {
                title: "Hivie",
            },
            {
                name: "description",
                content:
                    "Personal website of Hivie — osu!team member and software engineer. Portfolio and professional information.",
            },
            {
                name: "theme-color",
                content: "#e6e6e6",
            },
            {
                name: "og:title",
                content: "Hivie",
            },
            {
                name: "og:description",
                content: "dev and osu!",
            },
            {
                name: "og:url",
                content: "https://hivie.tn",
            },
            {
                name: "og:type",
                content: "website",
            },
            {
                name: "og:image",
                content: "https://hivie.tn/logo-transparent.png",
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),

    component: RootComponent,
});

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    );
}

function RootDocument({ children }: { children: React.ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              (function() {
                const theme = localStorage.getItem('portfolio-theme') || 'system';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const resolvedTheme = theme === 'system' ? systemTheme : theme;
                document.documentElement.classList.add(resolvedTheme);
              })();
            `,
                    }}
                />
            </head>
            <body className="min-h-screen antialiased">
                <div
                    className="transition-opacity duration-500 ease-out"
                    style={{ opacity: isHydrated ? 1 : 0 }}
                >
                    <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
                        <BackgroundBeamsWithCollision className="bg-background">{children}</BackgroundBeamsWithCollision>
                    </ThemeProvider>
                </div>
                <Scripts />
            </body>
        </html>
    );
}
