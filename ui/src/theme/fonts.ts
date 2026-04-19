import localFont from "next/font/local";

export const dmSans = localFont({
  src: [
    { path: "./fonts/DMSans-latin-ext.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/DMSans-latin.woff2", weight: "400 700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-dm-sans",
});

export const manrope = localFont({
  src: [
    { path: "./fonts/Manrope-cyrillic-ext.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/Manrope-cyrillic.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/Manrope-latin-ext.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/Manrope-latin.woff2", weight: "200 800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-manrope",
});

export const alibabaPuHuiTi = localFont({
  src: [
    { path: "./fonts/Alibaba-PuHuiTi-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Alibaba-PuHuiTi-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-alibaba-puhuiti",
});

export const notoSansSC = localFont({
  src: [
    { path: "./fonts/NotoSansSC-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/NotoSansSC-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-noto-sans-sc",
});

export const fontVariables = [
  dmSans.variable,
  manrope.variable,
  alibabaPuHuiTi.variable,
  notoSansSC.variable,
].join(" ");
