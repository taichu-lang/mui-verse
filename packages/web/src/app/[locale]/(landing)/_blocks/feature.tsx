import { UserIcon } from "@/components/icons";
import { ArrowRightLeftIcon, GlobeIcon, MessageCircleIcon } from "lucide-react";
import { Chip } from "./Chip";
import { WhiteSection } from "./Section";

function FeatureCard({
  Icon,
  title,
  description,
}: {
  Icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-47.5 flex-col gap-3.5 rounded-[30px] px-6 pt-6.5 shadow-(--mui-shadow-border)">
      <div className="flex h-10.5 w-10.5 items-center justify-center rounded-full bg-gray-950">
        <Icon className="h-6 w-6 text-white" strokeWidth="2" />
      </div>
      <p className="text-sm">{title}</p>
      <span className="text-text-secondary text-xs text-wrap">
        {description}
      </span>
    </div>
  );
}

export function FeatureSection() {
  return (
    <WhiteSection id="feature">
      <Chip label="Key features" />
      <p className="mt-7.5 text-2xl font-semibold">Why choose Plato</p>
      <p className="text-text-secondary mt-5 text-base">
        Stop switching between platforms. One account for your entire AI
        workflow.
      </p>
      <div className="mt-10 grid grid-cols-4 gap-5.5">
        <FeatureCard
          Icon={UserIcon}
          title="One account, multiple models"
          description="Skip the platform-hopping. Everything in one place."
        />
        <FeatureCard
          Icon={ArrowRightLeftIcon}
          title="Switch models anytime"
          description="Writing, coding, search, or summaries — pick the best model for each chat."
        />
        <FeatureCard
          Icon={GlobeIcon}
          title="Web search built in"
          description="Get current answers with cited sources."
        />
        <FeatureCard
          Icon={MessageCircleIcon}
          title="Full chat history"
          description="Every conversation saved and searchable — pick up right where you left off."
        />
      </div>
    </WhiteSection>
  );
}
