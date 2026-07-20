import { cn } from "@mui-verse/ui/utils/cn";
import Image from "next/image";
import { Chip } from "./Chip";
import { WhiteSection } from "./Section";

interface TextProps {
  title: string;
  description: string;
  items: string[];
}

interface CapabilityProps extends TextProps {
  img: string;
  height: number;
  width: number;
  reverse?: boolean;
}

function Capability({
  title,
  description,
  items,
  img,
  height,
  width,
  reverse = false,
}: CapabilityProps) {
  return (
    <div
      className={cn("flex items-center gap-11", {
        "flex-row-reverse": reverse,
      })}
    >
      <div className="flex flex-col items-start text-wrap">
        <p className="text-xl font-medium">{title}</p>
        <span className="text-text-secondary mt-5 text-base">
          {description}
        </span>
        <ul className="mt-5.5 flex list-disc flex-col gap-3 pl-3">
          {items.map((item) => (
            <li key={item} className="text-text-primary text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <Image src={img} alt={title} height={height} width={width} />
    </div>
  );
}

export function CapabilitiesSection() {
  const capabilities: CapabilityProps[] = [
    {
      title: "Instant answers to everyday questions",
      description:
        "Whether it's a quick fact, life advice, or a tricky concept — get clear, accurate answers in seconds.",
      items: [
        "Fast, reliable answers",
        "Well-organized and easy to scan",
        "Dig deeper with follow-up questions",
      ],
      img: "/images/landing-capability-01.png",
      height: 342,
      width: 588,
    },
    {
      title: "End-to-end content creation",
      description:
        "From drafting to polishing, rewriting, and summarizing — handle your entire writing process in one workspace.",
      items: [
        "Brainstorm ideas and draft content",
        "Polish, rewrite, and expand",
        "Summarize and extract key points",
      ],
      img: "/images/landing-capability-02.png",
      height: 344,
      width: 588,
      reverse: true,
    },
    {
      title: "Your AI coding partner",
      description:
        "Code explanations, snippets, and debugging tips — write code faster and with more confidence.",
      items: [
        "Explain complex code and functions",
        "Generate code snippets",
        "Suggest debugging and optimization ideas",
      ],
      img: "/images/landing-capability-03.png",
      height: 268,
      width: 588,
    },
    {
      title: "Real-time answers with cited sources",
      description:
        "Answers grounded in live search results — accurate on time-sensitive topics, always traceable back to the source.",
      items: [
        "Real-time web search",
        "Clickable source links",
        "Answers with a reference list",
      ],
      img: "/images/landing-capability-04.png",
      height: 418,
      width: 588,
      reverse: true,
    },
  ];
  return (
    <WhiteSection id="capabilities">
      <Chip label="Product capabilities" />
      <p className="mt-7.5 text-2xl font-semibold">
        From quick questions to complex tasks
      </p>
      <p className="text-text-secondary mt-5 text-base">
        Four core capabilities for learning, work, development & beyond.
      </p>
      <div className="mt-17.5 flex flex-col gap-15">
        {capabilities.map((c, index) => (
          <Capability {...c} key={index} />
        ))}
      </div>
    </WhiteSection>
  );
}
