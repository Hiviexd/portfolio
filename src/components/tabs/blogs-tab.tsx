import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon } from "@hugeicons/core-free-icons";

export function BlogsTab() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <HugeiconsIcon icon={Edit02Icon} className="size-8 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-medium text-foreground">Nothing yet..</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                Maybe one day I'll post my yapping sessions here whenever I get inspiration.
            </p>
        </div>
    );
}
