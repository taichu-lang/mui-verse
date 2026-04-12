import pino from "pino";

export const logger = pino({
  name: "mui-verse",
  level: "debug",
});
