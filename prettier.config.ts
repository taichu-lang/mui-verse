import { type Config } from "prettier";

const config: Config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["cn"],
  tailwindAttributes: ["bubbleClassName", "inputClassName"],
};

export default config;
