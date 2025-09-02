import CardsList from "@/components/composites/public/CardsList";
import ThreeCardsMovingOnHover from "@/components/organisms/ThreeCardsMovingOnHover";
import Faq from "@/components/organisms/Faq";
import StickyScrollableSlides from "@/components/organisms/StickyScrollableSlides";
import RecentBlogPosts from "@/components/composites/public/home/BlogGrid";
import { LogosMarquee } from "@/components/organisms/LogosMarquee";
import Hero from "@/components/organisms/home/Hero";
import OffersTable from "@/components/composites/public/OffersTable";
import { getAllServices } from "@/actions/ServiceAction";
import { getAllOffers } from "@/actions/OfferAction";
import { getUrl } from "@/lib/s3";
import { getAllBlogs } from "@/actions/BlogAction";
import { getAllProjects } from "@/actions/ProjectAction";
import CTA from "@/components/molecules/CTA";
import { getTranslations } from "next-intl/server";
import { generateSEOMetadata, generateStructuredData } from "@/lib/metadata";
import { Metadata } from "next";
import { contactData } from "@/data/contactData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const currentLocale = locale as "hr" | "en";
  const t = await getTranslations("metadata.home");

  const title = t("title");
  const description = t("description");
  const keywords = t("keywords")
    .split(",")
    .map((k) => k.trim());
  const seoPath = t("path");

  const ogImageParams = new URLSearchParams();
  ogImageParams.set("title", title);
  ogImageParams.set("locale", currentLocale);
  ogImageParams.set(
    "url",
    currentLocale === "hr"
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/${seoPath}` ||
          `https://www.msk.hr/${seoPath}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/en/${seoPath}` ||
          `https://www.msk.hr/en/${seoPath}`
  );

  const ogImageUrl = `/api/og?${ogImageParams.toString()}`;

  const alternateLanguages: { [key: string]: string } = {
    hr: currentLocale === "hr" ? "/" : "/",
    en: currentLocale === "hr" ? "/en" : "/en",
  };

  return await generateSEOMetadata({
    title,
    description,
    keywords,
    image: ogImageUrl,
    url: currentLocale === "hr" ? "/" : "/en",
    type: "website",
    locale: currentLocale,
    alternateLanguages,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations("home");

  const services = await getAllServices();
  const offersFromDb = await getAllOffers(locale as "hr" | "en");

  // Helper funkcija za dobijanje parent services
  const getParentServices = () => {
    return services
      .filter((service) => !service.parentServiceId)
      .sort((a, b) => a.order - b.order); // Sortiranje po order polju
  };

  // Helper funkcija za kreiranje stick scrollable slides
  const createStickScrollableSlides = async (
    parentServiceId: string,
    lang: "hr" | "en"
  ) => {
    const childServices = services
      .filter((service) => service.parentServiceId === parentServiceId)
      .sort((a, b) => a.order - b.order); // Sortiranje child servisa po order-u

    const slides = await Promise.all(
      childServices.map(async (service, index) => {
        const translation = service.translations?.find(
          (t) => t.languageCode === lang
        );
        const parentTranslation = services
          .find((s) => s.id === parentServiceId)
          ?.translations?.find((t) => t.languageCode === lang);

        const imageUrl = getUrl(service.image);

        return {
          id: index,
          title: translation?.title || service.id,
          description: translation?.description || "",
          link: `/services/${parentTranslation?.slug}/${translation?.slug}`,
          image: imageUrl,
        };
      })
    );

    return slides;
  };

  const parentServices = getParentServices();
  const projects = await getAllProjects(locale as "hr" | "en");

  // Kreiranje slides-ova za sve parent servise
  const allSlides = await Promise.all(
    parentServices.map(async (parentService) => ({
      parentService,
      slides: await createStickScrollableSlides(
        parentService.id,
        locale as "hr" | "en"
      ),
    }))
  );

  const blogs = await getAllBlogs(locale as "hr" | "en", 3);

  // Generate organization and website structured data
  const organizationSchema = generateStructuredData("Organization", {
    address: contactData.address,
    city: "Zagreb",
    phone: contactData.telephone,
    email: contactData.email,
    locale: locale,
  });

  const websiteSchema = generateStructuredData("WebSite", {
    locale: locale,
  });

  const faqSchema = generateStructuredData("FAQ", {
    locale: locale,
    faqs: [
      {
        "@type": "Question",
        name: t("faq.faq1.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.faq1.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.faq2.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.faq2.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.faq3.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.faq3.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.faq4.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.faq4.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.faq5.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.faq5.answer"),
        },
      },
      {
        "@type": "Question",
        name: t("faq.faq6.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("faq.faq6.answer"),
        },
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Hero
        offers={offersFromDb}
        locale={locale}
        title={t("hero.title")}
        secondButton={{
          href: "/offers",
          label: t("hero.exploreOffers"),
        }}
        firstButton={{
          href: "/contact",
          label: t("hero.getInTouch"),
        }}
        description={t("hero.description")}
      />
      <CardsList
        cards={projects.map((project, index) => ({
          id: index,
          title: project.translations[0].title,
          description: project.translations[0].description,
          icon: getUrl(project.image),
          ctaText: t("projects.learnMore"),
          link: {
            href: `/projects/${project.translations[0].slug}`,
            text: t("projects.learnMore"),
          },
          badge: project.services
            .map(
              (service) =>
                service.service?.translations?.find(
                  (t) => t.languageCode === locale
                )?.title
            )
            .filter((title) => title !== undefined)
            .join(", "),
        }))}
        title={t("projects.title")}
        description={t("projects.description")}
        link={{ href: "/projects", text: t("projects.learnMore") }}
      />
      {allSlides.map(
        ({ parentService, slides }, index) =>
          slides.length > 0 && (
            <StickyScrollableSlides
              key={parentService.id}
              items={slides}
              rowReverse={index % 2 === 0}
            />
          )
      )}
      <OffersTable
        offers={offersFromDb}
        locale={locale}
        title={t("offers.title")}
      />
      <ThreeCardsMovingOnHover
        items={[
          {
            number: "01",
            title: t("webshop.mobileApp.title"),
            image: "/marketing-creative-collage-with-phone.jpg",
            description: t("webshop.mobileApp.description"),
          },
          {
            number: "02",
            title: t("webshop.website.title"),
            image: "/webshop-webpage.webp",
            description: t("webshop.website.description"),
          },
          {
            number: "03",
            title: t("webshop.trackingApp.title"),
            image: "/webshop-dashboard.webp",
            description: t("webshop.trackingApp.description"),
          },
        ]}
        title={t("webshop.title")}
        description={t("webshop.description")}
      />{" "}
      <CTA
        title={t("cta.title")}
        description={t("cta.description")}
        buttonText={t("cta.buttonText")}
      />{" "}
      <RecentBlogPosts
        blogs={blogs}
        title={t("blog.title")}
        description={t("blog.description")}
        ctaText={t("blog.ctaText")}
        cardCtaText={t("blog.cardCtaText")}
      />
      <LogosMarquee
        title={t("technologies.title")}
        description={t("technologies.description")}
        images={[
          {
            title: "Adobe Illustrator",
            image: "/technology/adobe-illustrator.png",
          },
          {
            title: "Figma",
            image: "/technology/figma.png",
          },
          {
            title: "Inkscape",
            image: "/technology/inkscape.png",
          },
          {
            title: "Node.js",
            image: "/technology/nodejs.png",
          },
          {
            title: "React",
            image: "/technology/react.png",
          },
          {
            title: "Tailwind",
            image: "/technology/tailwind.png",
          },
          {
            title: "Typescript",
            image: "/technology/typescript.png",
          },
          {
            title: "Nest.js",
            image: "/technology/nestjs.png",
          },
          {
            title: "Postgree",
            image: "/technology/postgree.png",
          },
          {
            title: "Sebury",
            image: "/technology/sebury.png",
          },
          {
            title: "Tauri",
            image: "/technology/tauri.png",
          },
          {
            title: "SQLite",
            image: "/technology/sqlite.png",
          },
          {
            title: "Prisma",
            image: "/technology/prisma.png",
          },
          {
            title: "AWS",
            image: "/technology/aws.png",
          },
          {
            title: "Docker",
            image: "/technology/docker.png",
          },
        ]}
      />{" "}
      <Faq
        items={[
          {
            id: "item-1",
            question: t("faq.faq1.question"),
            answer: (
              <div className="flex flex-col gap-4">
                <p className="text-sm xl:text-base whitespace-pre-line">
                  {t("faq.faq1.answer")}
                </p>
              </div>
            ),
          },
          {
            id: "item-2",
            question: t("faq.faq2.question"),
            answer: (
              <div className="flex flex-col gap-4">
                <p className="text-sm xl:text-base whitespace-pre-line">
                  {t("faq.faq2.answer")}
                </p>
              </div>
            ),
          },
          {
            id: "item-3",
            question: t("faq.faq3.question"),
            answer: (
              <div className="flex flex-col gap-4">
                <p className="text-sm xl:text-base whitespace-pre-line">
                  {t("faq.faq3.answer")}
                </p>
              </div>
            ),
          },
          {
            id: "item-4",
            question: t("faq.faq4.question"),
            answer: (
              <div className="flex flex-col gap-4">
                <p className="text-sm xl:text-base whitespace-pre-line">
                  {t("faq.faq4.answer")}
                </p>
              </div>
            ),
          },
          {
            id: "item-5",
            question: t("faq.faq5.question"),
            answer: (
              <div className="flex flex-col gap-4">
                <p className="text-sm xl:text-base whitespace-pre-line">
                  {t("faq.faq5.answer")}
                </p>
              </div>
            ),
          },
          {
            id: "item-6",
            question: t("faq.faq6.question"),
            answer: (
              <div className="flex flex-col gap-4">
                <p className="text-sm xl:text-base whitespace-pre-line">
                  {t("faq.faq6.answer")}
                </p>
              </div>
            ),
          },
        ]}
      />{" "}
    </>
  );
}
