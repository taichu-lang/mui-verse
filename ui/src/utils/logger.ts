import "server-only";

import { mkdirSync } from "fs";
import { join } from "path";
import pino from "pino";

export function getLogger(component: string): pino.Logger {
  let dest = pino.destination(1);
  if (process.env.NODE_ENV === "production") {
    const cwd = process.cwd();
    const logs = join(cwd, "logs");
    mkdirSync(logs, { recursive: true });

    dest = pino.destination(join(logs, `${component}.log`));
  }

  const logger = pino(
    {
      name: component,
      level: "debug",
    },
    dest,
  );

  return logger;
}
