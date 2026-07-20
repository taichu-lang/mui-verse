import Image from "next/image";
import { Chip } from "./Chip";
import { Section } from "./Section";

export function UiSection() {
  return (
    <Section id="ui">
      <Chip label="Product UI" gray />
      <p className="mt-7.5 text-2xl font-semibold">
        Clean, consistent interactions
      </p>
      <span className="text-text-secondary mt-5 text-base">
        AI workflows that feel familiar.
      </span>
      <div className="mt-15 grid grid-cols-2 gap-25">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-medium">Complete conversation history</p>
          <span className="text-text-secondary text-base">
            Keeps full conversation history
          </span>
          <Image
            src={"/images/landing-ui-01.png"}
            alt="ui-01"
            width={269}
            height={253}
            className="mt-3"
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-medium">Multiple leading AI models</p>
          <span className="text-text-secondary text-base">
            This is only a partial list of available models
          </span>
          <Image
            src={"/images/landing-ui-02.png"}
            alt="ui-01"
            width={264}
            height={432}
            className="mt-3"
          />
        </div>
      </div>
      <div className="mt-20 flex flex-col items-center gap-3">
        <p className="text-xl font-medium">Web search</p>
        <span className="text-text-secondary text-base">
          Combine AI reasoning with real-time web results
        </span>
        <Image
          src={"/images/landing-ui-03.png"}
          alt="web search"
          width={770}
          height={246}
          className="mt-9"
        />
      </div>
      <div className="mt-20 flex flex-col items-center gap-3">
        <p className="text-xl font-medium">Sources</p>
        <span className="text-text-secondary text-xl">
          Reliable answers, backed by real sources
        </span>
        <Image
          src={"/images/landing-ui-04.png"}
          alt="web search annotation"
          width={870}
          height={523}
          className="mt-4"
        />
      </div>
    </Section>
  );
}
