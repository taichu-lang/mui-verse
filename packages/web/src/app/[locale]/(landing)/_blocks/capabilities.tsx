import { cn } from "@mui-verse/ui/utils/cn";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Chip } from "./Chip";
import { Section } from "./Section";

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
  priority?: boolean;
}

function Capability({
  title,
  description,
  items,
  img,
  height,
  width,
  reverse = false,
  priority = false,
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
      <Image
        src={img}
        alt={title}
        height={height}
        width={width}
        priority={priority}
      />
    </div>
  );
}

export function CapabilitiesSection() {
  const t = useTranslations();

  const capabilities: CapabilityProps[] = [
    {
      title: t("landing.capabilities.instant.title"),
      description: t("landing.capabilities.instant.description"),
      items: [
        t("landing.capabilities.instant.item1"),
        t("landing.capabilities.instant.item2"),
        t("landing.capabilities.instant.item3"),
      ],
      img: "/images/landing-capability-01.png",
      height: 342,
      width: 588,
      // Eager-load the first image so its box is reserved before the user can
      // click a nav anchor — otherwise later Image hydration shifts sections
      // below and the first #product jump lands with a doubled offset.
      priority: true,
    },
    {
      title: t("landing.capabilities.creation.title"),
      description: t("landing.capabilities.creation.description"),
      items: [
        t("landing.capabilities.creation.item1"),
        t("landing.capabilities.creation.item2"),
        t("landing.capabilities.creation.item3"),
      ],
      img: "/images/landing-capability-02.png",
      height: 344,
      width: 588,
      reverse: true,
    },
    {
      title: t("landing.capabilities.coding.title"),
      description: t("landing.capabilities.coding.description"),
      items: [
        t("landing.capabilities.coding.item1"),
        t("landing.capabilities.coding.item2"),
        t("landing.capabilities.coding.item3"),
      ],
      img: "/images/landing-capability-03.png",
      height: 268,
      width: 588,
    },
    {
      title: t("landing.capabilities.search.title"),
      description: t("landing.capabilities.search.description"),
      items: [
        t("landing.capabilities.search.item1"),
        t("landing.capabilities.search.item2"),
        t("landing.capabilities.search.item3"),
      ],
      img: "/images/landing-capability-04.png",
      height: 418,
      width: 588,
      reverse: true,
    },
  ];
  return (
    <Section id="capabilities" white>
      <Chip label={t("landing.capabilities.chip")} />
      <h2 className="mt-7.5">{t("landing.capabilities.title")}</h2>
      <p className="text-text-secondary mt-5 text-base">
        {t("landing.capabilities.subtitle")}
      </p>
      <div className="mt-17.5 flex flex-col gap-15">
        {capabilities.map((c, index) => (
          <Capability {...c} key={index} />
        ))}
      </div>
    </Section>
  );
}
