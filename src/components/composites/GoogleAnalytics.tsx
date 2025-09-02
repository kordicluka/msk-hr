"use client";
import Script from "next/script";

const GoogleAnalytics = () => {
  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
      />
      <Script id="gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
