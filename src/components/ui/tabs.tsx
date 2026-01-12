import { useLayoutEffect, useRef, useState, Children, cloneElement, isValidElement } from "react";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn("gap-2 group/tabs flex data-[orientation=horizontal]:flex-col", className)}
            {...props}
        />
    );
}

const tabsListVariants = cva(
    "rounded-lg p-[3px] group-data-horizontal/tabs:h-8 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
    {
        variants: {
            variant: {
                default: "bg-muted",
                line: "gap-1 bg-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

interface AnimatedTabsListProps extends TabsPrimitive.List.Props, VariantProps<typeof tabsListVariants> {
    activeValue?: string | number | null;
}

function TabsList({
    className,
    variant = "default",
    activeValue,
    children,
    ...props
}: AnimatedTabsListProps) {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
    const [mounted, setMounted] = useState(false);

    useLayoutEffect(() => {
        setMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!mounted || variant !== "line" || activeValue === undefined) return;

        // Get tab values from children inline to avoid dependency array issues
        const tabValues = Children.toArray(children)
            .filter(isValidElement)
            .map((child) => (child.props as { value?: string | number }).value);

        const activeIndex = tabValues.findIndex((value) => value === activeValue);
        const activeTabElement = tabRefs.current[activeIndex];

        if (activeTabElement) {
            const { offsetLeft, offsetWidth } = activeTabElement;
            setUnderlineStyle({
                left: offsetLeft,
                width: offsetWidth,
            });
        }
    }, [activeValue, mounted, variant, children]);

    // Clone children to attach refs
    const enhancedChildren =
        variant === "line"
            ? Children.toArray(children)
                  .filter(isValidElement)
                  .map((child, index) =>
                      cloneElement(child as React.ReactElement<{ ref?: React.Ref<HTMLButtonElement> }>, {
                          ref: (el: HTMLButtonElement | null) => {
                              tabRefs.current[index] = el;
                          },
                      }),
                  )
            : children;

    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            className={cn(tabsListVariants({ variant }), "relative", className)}
            {...props}
        >
            {enhancedChildren}

            {variant === "line" && mounted && underlineStyle.width > 0 && (
                <motion.div
                    className="bg-foreground absolute bottom-0 z-20 h-0.5"
                    layoutId="tabs-underline"
                    animate={{
                        left: underlineStyle.left,
                        width: underlineStyle.width,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 40,
                    }}
                />
            )}
        </TabsPrimitive.List>
    );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
    return (
        <TabsPrimitive.Tab
            data-slot="tabs-trigger"
            className={cn(
                "gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
                "data-active:bg-background dark:data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 data-active:text-foreground",
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
    return (
        <TabsPrimitive.Panel
            data-slot="tabs-content"
            className={cn("text-sm flex-1 outline-none", className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
