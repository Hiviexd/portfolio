import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder02Icon, Briefcase01Icon, CodeIcon, Edit02Icon } from "@hugeicons/core-free-icons";

export function TabsSection() {
    const navigate = useNavigate();
    const currentPath = useRouterState({ select: (s) => s.location.pathname });

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

    // Map routes to tab values
    const routeToTab: Record<string, string> = {
        "/": "projects",
        "/experience": "experience",
        "/skills": "skills",
        "/blog": "blogs",
    };

    // Determine active tab from current route
    const tabFromRoute =
        routeToTab[currentPath] ?? (currentPath.startsWith("/projects/") ? "projects" : "projects");

    return (
        <section className="mt-10">
            <Tabs value={tabFromRoute} onValueChange={handleTabChange}>
                <div className="mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsList variant="line" activeValue={tabFromRoute} className="w-full sm:w-fit">
                        <TabsTrigger value="projects" className="cursor-pointer">
                            <HugeiconsIcon icon={Folder02Icon} strokeWidth={2} className="sm:mr-1.5" />
                            <span className="hidden sm:inline">Projects</span>
                        </TabsTrigger>
                        <TabsTrigger value="experience" className="cursor-pointer">
                            <HugeiconsIcon icon={Briefcase01Icon} strokeWidth={2} className="sm:mr-1.5" />
                            <span className="hidden sm:inline">Experience</span>
                        </TabsTrigger>
                        <TabsTrigger value="skills" className="cursor-pointer">
                            <HugeiconsIcon icon={CodeIcon} strokeWidth={2} className="sm:mr-1.5" />
                            <span className="hidden sm:inline">Skills</span>
                        </TabsTrigger>
                        <TabsTrigger value="blogs" className="cursor-pointer">
                            <HugeiconsIcon icon={Edit02Icon} strokeWidth={2} className="sm:mr-1.5" />
                            <span className="hidden sm:inline">Blogs</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Content from child routes */}
                <Outlet />
            </Tabs>
        </section>
    );
}
