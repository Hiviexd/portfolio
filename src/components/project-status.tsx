import type { Project } from "@/components/tabs/projects-tab";

type ProjectStatusProps = {
    status: Project["status"];
    className?: string;
};

export function ProjectStatus({ status, className }: ProjectStatusProps) {
    const statusConfig: Record<Project["status"], { bg: string; text: string; dot: string }> = {
        Active: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-600 dark:text-emerald-400",
            dot: "bg-emerald-500",
        },
        Completed: {
            bg: "bg-blue-500/10",
            text: "text-blue-600 dark:text-blue-400",
            dot: "bg-blue-500",
        },
        Maintainer: {
            bg: "bg-cyan-500/10",
            text: "text-cyan-600 dark:text-cyan-400",
            dot: "bg-cyan-500",
        },
    };

    const config = statusConfig[status] || statusConfig["Maintainer"];

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.text} ${className || ""}`}>
            <span className={`size-1.5 rounded-full ${config.dot}`} />
            {status}
        </span>
    );
}
