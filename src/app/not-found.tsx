import Link from "next/link";
import { ArrowButton } from "@/components/atoms/button";

interface NotFoundProps {
  locale?: string;
}

export default function NotFound({ locale }: NotFoundProps) {
  // Ako nema locale prop, koristi hrvatski kao default
  const currentLocale = locale || "hr";
  const isHr = currentLocale === "hr";

  return (
    <html lang={currentLocale}>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-primary mb-8">404</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Stranica nije pronađena / Page Not Found
              </h2>
              <p className="text-gray-600 mb-8">
                {isHr
                  ? "Nažalost, stranica koju tražite ne postoji ili je premještena."
                  : "Sorry, the page you are looking for does not exist or has been moved."}
              </p>
            </div>

            <div>
              <Link href={`/${currentLocale}`}>
                <ArrowButton size="lg" className="w-full">
                  {isHr ? "Povratak na početnu" : "Back to Home"}
                </ArrowButton>
              </Link>

              <Link href={isHr ? "/hr/kontakt" : "/en/contact"}>
                <ArrowButton variant="ghost" size="lg" className="w-full mt-4">
                  {isHr ? "Kontaktiraj nas" : "Contact Us"}
                </ArrowButton>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {isHr ? "Trebate pomoć?" : "Need help?"}{" "}
                <Link
                  href={isHr ? "/hr/kontakt" : "/en/contact"}
                  className="text-primary hover:underline"
                >
                  {isHr ? "Pošaljite nam poruku" : "Send us a message"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </body>{" "}
    </html>
  );
}
