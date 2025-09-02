import { Locale, NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

type Props = {
  params: Promise<{ locale: Locale }>;
  children: React.ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr"
  ),
};

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <link
          rel="alternate"
          hrefLang="hr"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr"}`}
        />
        <link
          rel="alternate"
          hrefLang="en"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr"}/en`}
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.msk.hr"}`}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {" "}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
