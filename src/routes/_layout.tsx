import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { SocialLinks } from "@/components/layout/social-links";
import { Description } from "@/components/layout/description";
import { TabsSection } from "@/components/layout/tabs-section";
import { Footer } from "@/components/layout/footer";

export const Route = createFileRoute("/_layout")({
    component: LayoutComponent,
});

function LayoutComponent() {
    return (
        <main className="relative z-10 mx-auto max-w-2xl px-4 py-12 sm:py-16 w-full">
            {/* Top Section */}
            <section className="space-y-4">
                <Header />
                <Description />
                <SocialLinks />
            </section>

            {/* Main Section with Tabs */}
            <TabsSection />

            {/* Footer */}
            <Footer />
        </main>
    );
}
