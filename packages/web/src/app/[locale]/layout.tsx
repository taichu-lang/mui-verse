import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@mui-verse/ui/theme";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Toaster } from "react-hot-toast";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={`antialiased`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <main className="h-screen overflow-hidden bg-white">
              {children}
            </main>
            <Toaster
              toastOptions={{
                success: {
                  duration: 3000,
                  removeDelay: 1000,
                  className: "px-2",
                },
                error: {
                  duration: 5000,
                  removeDelay: 2000,
                },
              }}
            />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
