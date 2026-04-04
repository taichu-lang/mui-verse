import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeRegistry } from "./ThemeRegistry";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeRegistry>{children}</ThemeRegistry>
    </AppRouterCacheProvider>
  );
}
