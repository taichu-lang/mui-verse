import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["192.168.*.*"],
};

const withLocale = createNextIntlPlugin();

export default withLocale(nextConfig);
