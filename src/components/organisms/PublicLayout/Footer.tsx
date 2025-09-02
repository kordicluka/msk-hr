"use client";

import { Button } from "@/components/atoms/button";
import { Link } from "@/i18n/navigation";
import NewsletterSignup from "@/components/composites/NewsletterSignup";
import { useCookies } from "@/contexts/CookiesContext";
import { Instagram } from "lucide-react";
import { contactData } from "@/data/contactData";

export interface FooterCategory {
  title: string;
  links: {
    title: string;
    href: string;
  }[];
}

export interface FooterColumn {
  categories: FooterCategory[];
}

export default function Footer({
  footerColumns = [],
  ctaTitle,
  ctaButtonPrimary,
  ctaButtonSecondary,
  ctaDescription,
  newsletterTitle,
  newsletterDescription,
  privacyItem1,
  privacyItem2,
  privacyItem3,
  newsletterSuccessMessage,
  newsletterErrorMessage,
}: {
  footerColumns?: FooterColumn[];
  ctaTitle: string;
  ctaButtonPrimary: string;
  ctaButtonSecondary: string;
  ctaDescription: string;
  newsletterTitle: string;
  newsletterDescription: string;
  privacyItem1: string;
  privacyItem2: string;
  privacyItem3: string;
  newsletterSuccessMessage: string;
  newsletterErrorMessage: string;
}) {
  const { openCookieSettings } = useCookies();
  return (
    <footer className="bg-primary overflow-hidden text-white px-6 pt-30 pb-10 text-sm relative">
      <div className="absolute -top-[70rem] right-0 h-[200rem] w-[100rem] rounded-full bg-[radial-gradient(circle,#09daff0f,transparent_35%)] "></div>
      <div className="container mx-auto relative z-10">
        {/* Top CTA */}
        <div className="text-center mb-40">
          <h3 className="max-w-4xl mx-auto font-bold mb-8">{ctaTitle}</h3>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/offers" className="hover:underline">
              <Button className="bg-transparent text-white border-white">
                {ctaButtonSecondary}
              </Button>
            </Link>{" "}
            <Link href="/contact" className="hover:underline">
              <Button>{ctaButtonPrimary}</Button>{" "}
            </Link>
          </div>
          <p className="mt-6 text-xs text-gray-400">{ctaDescription}</p>
        </div>

        {/* Email Signup */}
        <div className="text-center mb-40">
          <h3 className=" max-w-4xl mx-auto font-bold mb-4">
            {newsletterTitle}
          </h3>
          <p className="mb-12 text-base font-light">{newsletterDescription}</p>
          <NewsletterSignup
            successMessage={newsletterSuccessMessage}
            errorMessage={newsletterErrorMessage}
          />
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 text-white mb-10 w-full">
          {footerColumns.map((column, index) => (
            <div key={index + "footer-column"}>
              {column.categories.map((category, index) => (
                <div
                  key={index + "footer-category" + category.title}
                  className="mb-8"
                >
                  <h6 className="text-gray-400 text-base font-semibold mb-4">
                    {category.title}
                  </h6>
                  <ul className="space-y-1 font-semibold text-lg">
                    {category.links.map((link, index) => (
                      <li key={index + "footer-link" + link.title}>
                        <a href={link.href} className="hover:underline">
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <a
            href={contactData.socialMedia.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram size={24} />
          </a>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between text-gray-500 text-xs">
          <div className="mb-4 md:mb-0">
            <p>© {new Date().getFullYear()} msk j.d.o.o.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button onClick={openCookieSettings} className="hover:underline">
              {privacyItem1}
            </button>
            <Link href="/privacy-policy" className="hover:underline">
              {privacyItem2}
            </Link>
            <Link href="/terms-of-service" className="hover:underline">
              {privacyItem3}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
