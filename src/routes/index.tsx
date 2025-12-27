import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { SocialLinks } from "@/components/social-links";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProjectsTab } from "@/components/tabs/projects-tab";
import { ExperienceTab } from "@/components/tabs/experience-tab";
import { SkillsTab } from "@/components/tabs/skills-tab";
import { BlogsTab } from "@/components/tabs/blogs-tab";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder02Icon, Briefcase01Icon, CodeIcon, Edit02Icon } from "@hugeicons/core-free-icons";

export const Route = createFileRoute("/")({ component: App });

function App() {
    return (
        <main className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
            {/* Top Section */}
            <section className="space-y-4">
                <Header />

                {/* Description */}
                <p className="text-muted-foreground text-[15px] leading-relaxed">
                    Software Engineer based in San Francisco. Passionate about building products that make a difference.
                    Currently focused on developer tools and open source.
                </p>

                {/* Social Links */}
                <SocialLinks />
            </section>

            {/* Main Section with Tabs */}
            <section className="mt-10">
                <Tabs defaultValue="projects">
                    <TabsList variant="line" className="mb-6">
                        <TabsTrigger value="projects">
                            <HugeiconsIcon icon={Folder02Icon} strokeWidth={2} />
                            Projects
                        </TabsTrigger>
                        <TabsTrigger value="experience">
                            <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} />
                            Experience
                        </TabsTrigger>
                        <TabsTrigger value="skills">
                            <HugeiconsIcon icon={CodeIcon} strokeWidth={2} />
                            Skills
                        </TabsTrigger>
                        <TabsTrigger value="blogs">
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} />
                            Blogs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="projects">
                        <ProjectsTab />
                    </TabsContent>

                    <TabsContent value="experience">
                        <ExperienceTab />
                    </TabsContent>

                    <TabsContent value="skills">
                        <SkillsTab />
                    </TabsContent>

                    <TabsContent value="blogs">
                        <BlogsTab />
                    </TabsContent>
                </Tabs>
            </section>

            {/* Footer */}
            <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                <p>Built with TanStack Start & shadcn/ui</p>
            </footer>
        </main>
    );
}
