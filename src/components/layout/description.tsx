import { AgeCounter } from "@/components/misc/age-counter";
import metadata from "../../../data/metadata.json";

export function Description() {
    return (
        <p className="text-muted-foreground text-[15px] leading-relaxed">
            Software Engineer and{" "}
            <a
                href="https://osu.ppy.sh/wiki/en/People/osu%21_team"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground link-fancy transition-all"
            >
                osu!team
            </a>{" "}
            member.{" "}
            <code>
                <AgeCounter startDate={new Date(metadata.birthday)} />
            </code>{" "}
            years old with a passion for open source, building awesome stuff, and the osu! community.
        </p>
    );
}
