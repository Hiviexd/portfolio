import { useQueryState, useQueryStates } from "nuqs";
import {
    searchParamsParsers,
    defaultOptions,
    getActiveTab,
    type TabValue,
} from "@/lib/search-params";

/**
 * Hook to manage all navigation search params together
 * Returns the active tab derived from all params
 */
export function useNavigationParams() {
    const [params, setParams] = useQueryStates(searchParamsParsers, defaultOptions);

    const activeTab = getActiveTab(params);

    const setTab = (tab: TabValue) => {
        // When switching tabs, clear project/blog selection
        if (tab === "experience" || tab === "skills" || tab === "blogs") {
            setParams({ t: tab, p: null, b: null });
        } else if (tab === "projects") {
            setParams({ t: null, p: null, b: null });
        }
    };

    return {
        params,
        activeTab,
        setTab,
        setParams,
    };
}

/**
 * Hook for project selection
 */
export function useProjectParam() {
    const [projectId, setProjectId] = useQueryState("p", {
        ...defaultOptions,
        parse: (value) => value || null,
    });

    return [projectId, setProjectId] as const;
}

/**
 * Hook for blog selection
 */
export function useBlogParam() {
    const [blogId, setBlogId] = useQueryState("b", {
        ...defaultOptions,
        parse: (value) => value || null,
    });

    return [blogId, setBlogId] as const;
}
