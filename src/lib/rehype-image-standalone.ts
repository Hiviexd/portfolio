type HastNode = {
    type?: string;
    tagName?: string;
    properties?: Record<string, unknown>;
    children?: HastNode[];
};

/**
 * Rehype plugin that marks image nodes with `dataStandalone: true` when they
 * are the only child of their parent (so the image is standalone in its block).
 */
export function rehypeImageStandalone() {
    return (tree: HastNode) => {
        visit(tree, null);
    };

    function visit(node: HastNode, parent: HastNode | null): void {
        if (node.type === "element") {
            if (node.tagName === "img" && parent?.children?.length === 1) {
                node.properties = node.properties || {};
                node.properties.dataStandalone = true;
            }
            if (Array.isArray(node.children)) {
                for (const child of node.children) {
                    visit(child, node);
                }
            }
        } else if (Array.isArray(node.children)) {
            for (const child of node.children) {
                visit(child, node);
            }
        }
    }
}
