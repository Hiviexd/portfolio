import experienceData from "../../../data/experience.json";
import { ExperienceEntry } from "@/components/experience/experience-entry";

type Experience = {
    id: string;
    role: string;
    company: string;
    location: string;
    type: string;
    startDate: string;
    endDate: string;
    description: string;
    responsibilities: string[];
    stack: string[];
};

export function ExperienceTab() {
    const experiences = experienceData as Experience[];

    return (
        <div className="space-y-0">
            {experiences.map((exp, index) => (
                <ExperienceEntry key={exp.id} experience={exp} isLast={index === experiences.length - 1} />
            ))}
        </div>
    );
}
