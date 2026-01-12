import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import { Folder02Icon, Briefcase01Icon, CodeIcon, Edit02Icon } from "@hugeicons/core-free-icons";
import { useNavigationParams } from "@/hooks/use-search-params";
import { type TabValue } from "@/lib/search-params";
import { ProjectsTab } from "@/components/tabs/projects-tab";
import { ExperienceTab } from "@/components/tabs/experience-tab";
import { SkillsTab } from "@/components/tabs/skills-tab";
import { BlogsTab } from "@/components/tabs/blogs-tab";

export function TabsSection() {
    const { activeTab, setTab } = useNavigationParams();

    const handleTabChange = (value: string) => {
        setTab(value as TabValue);
    };

    return (
        <section className="mt-10">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <div className="mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <TabsList variant="line" activeValue={activeTab} className="w-full sm:w-fit">
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
                            <span className="hidden sm:inline">Blog</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Render tab content inline based on active tab */}
                {activeTab === "projects" && <ProjectsTab />}
                {activeTab === "experience" && <ExperienceTab />}
                {activeTab === "skills" && <SkillsTab />}
                {activeTab === "blogs" && <BlogsTab />}
            </Tabs>
        </section>
    );
}
