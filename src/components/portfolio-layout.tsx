import { Header } from "@/components/header";
import { SocialLinks } from "@/components/social-links";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder02Icon, Briefcase01Icon, CodeIcon, Edit02Icon } from "@hugeicons/core-free-icons";
import { useRouter, useNavigate } from "@tanstack/react-router";
import { AgeCounter } from "@/components/age-counter";

type PortfolioLayoutProps = {
    children: React.ReactNode;
    activeTab?: string;
};

export function PortfolioLayout({ children, activeTab }: PortfolioLayoutProps) {
    const router = useRouter();
    const navigate = useNavigate();

    const handleTabChange = (value: string) => {
        const routes: Record<string, string> = {
            projects: "/",
            experience: "/experience",
            skills: "/skills",
            blogs: "/blog",
        };

        const route = routes[value];
        if (route) {
            navigate({ to: route });
        }
    };

    // Determine active tab from current route
    const currentPath = router.state.location.pathname;
    const tabFromRoute =
        currentPath === "/" || currentPath.startsWith("/projects/")
            ? "projects"
            : currentPath === "/experience"
              ? "experience"
              : currentPath === "/skills"
                ? "skills"
                : currentPath === "/blog"
                  ? "blogs"
                  : activeTab || "projects";

    return (
        <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:py-16 w-full">
            {/* Top Section */}
            <section className="space-y-4">
                <Header />

                {/* Description */}
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                    Software Engineer and{" "}
                    <a
                        href="https://osu.ppy.sh/wiki/en/People/osu%21_team"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground link-fancy">
                        osu!team
                    </a>{" "}
                    member.{" "}
                    <code>
                        <AgeCounter startDate={new Date("2002-02-10")} />
                    </code>{" "}
                    years old with a passion for open source, building awesome stuff, and the osu! community.
                </p>

                {/* Social Links */}
                <SocialLinks />
            </section>

            {/* Main Section with Tabs */}
            <section className="mt-10">
                <Tabs value={tabFromRoute} onValueChange={handleTabChange}>
                    <TabsList variant="line" className="mb-6">
                        <TabsTrigger value="projects" className="cursor-pointer">
                            <HugeiconsIcon icon={Folder02Icon} strokeWidth={2} />
                            Projects
                        </TabsTrigger>
                        <TabsTrigger value="experience" className="cursor-pointer">
                            <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} />
                            Experience
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="cursor-pointer">
                            <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                            Skills
                        </TabsTrigger>
                        <TabsTrigger value="blogs" className="cursor-pointer">
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                            Blogs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects">{children}</TabsContent>
                    <TabsContent value="experience">{children}</TabsContent>
                    <TabsContent value="skills">{children}</TabsContent>
                    <TabsContent value="blogs">{children}</TabsContent>
                </Tabs>
            </section>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                <p>Built with TanStack Start & shadcn/ui</p>
            </footer>
        </main>
    );
}
