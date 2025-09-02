"use client";

import React, { useState, useEffect } from "react";
import { acceptAllCookies, checkCookies } from "@/actions/CookiesActions";
import GoogleAnalytics from "../../composites/GoogleAnalytics";
import { Button } from "@/components/atoms/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCookies } from "@/contexts/CookiesContext";

interface CookiesState {
  necessary: boolean;
  statistics: boolean;
}

const Cookies: React.FC = () => {
  const t = useTranslations("cookies");
  const { showCookieSettings, openCookieSettings, closeCookieSettings } =
    useCookies();

  const [cookiesAccepted, setCookiesAccepted] = useState<CookiesState>({
    necessary: false,
    statistics: false,
  });
  const [cookiesPopup, setCookiesPopup] = useState<boolean>(false);

  useEffect(() => {
    checkCookiesAccepted();
  }, []);

  const handleCookiesAccept = async (): Promise<void> => {
    setCookiesAccepted({
      necessary: true,
      statistics: true,
    });

    await acceptAllCookies();
    closeCookieSettings();
    setCookiesPopup(false);
  };

  const checkCookiesAccepted = async (): Promise<void> => {
    const res = await checkCookies();

    if (res.all) {
      setCookiesAccepted({
        necessary: true,
        statistics: true,
      });
    } else {
      setCookiesPopup(true);
    }
  };

  const handleToggle = (type: keyof CookiesState) => (): void => {
    setCookiesAccepted((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <>
      {cookiesAccepted.statistics && <GoogleAnalytics />}
      <section
        className={`fixed left-1/2 -translate-x-1/2 md:translate-0 bottom-6 md:bottom-10 md:left-10 bg-white p-8 rounded-lg z-50 flex flex-col items-start gap-1 shadow-xl w-[30rem] max-w-[90vw] ${
          cookiesPopup ? "" : "hidden"
        }`}
      >
        <h4 className="text-3xl tracking-tighter font-bold text-gray-800 mb-4">
          {t("title")}
        </h4>
        <p className="text-sm text-gray-500 leading-tight">
          {t("description")}
        </p>

        <div className="w-full flex flex-row  items-center py-6">
          <div className="flex items-center gap-3 pr-4">
            <span className="text-xs text-gray-600">{t("necessary")}</span>
            <button
              className={`w-10 h-5  rounded-full p-1 duration-300 ease-in-out ${
                true ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-[.8rem] h-[.8rem] -translate-y-[.05rem]  rounded-full shadow-md transform duration-300 ease-in-out ${
                  true ? "translate-x-[1.25rem]" : ""
                }`}
              ></div>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">{t("statistics")}</span>
            <button
              className={`w-10 h-5  rounded-full p-1 duration-300 ease-in-out ${
                cookiesAccepted.statistics ? "bg-primary" : "bg-gray-300"
              }`}
              onClick={handleToggle("statistics")}
            >
              <div
                className={`bg-white w-[.8rem] h-[.8rem] -translate-y-[.05rem]  rounded-full shadow-md transform duration-300 ease-in-out ${
                  cookiesAccepted.statistics ? "translate-x-[1.25rem]" : ""
                }`}
              ></div>
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row-reverse items-center gap-2 w-full">
          <Button
            size={"sm"}
            onClick={handleCookiesAccept}
            className="md:w-1/2 w-full"
          >
            <span>{t("acceptAll")}</span>
          </Button>
          <Button
            onClick={() => {
              openCookieSettings();
            }}
            size={"sm"}
            variant={"outline"}
            className="md:w-1/2 w-full"
          >
            <span className="text-black">{t("cookieSettings")}</span>
          </Button>
        </div>
      </section>
      <section
        className={`fixed bottom-10  rounded-xl shadow-xl p-10 left-10 bg-white flex flex-col gap-2 z-[100000000000] border-r border-gray-200 w-[30rem] ${
          showCookieSettings ? "flex" : "hidden"
        } `}
      >
        <div className="flex z-20 flex-col gap-4 w-full rounded-xl">
          <h4 className="text-3xl tracking-tighter mb-2 font-bold text-gray-800">
            {t("settingsTitle")}
          </h4>
          <p className="text-sm text-gray-700">{t("settingsDescription")}</p>
          <Link
            href="/privacy-policy"
            onClick={closeCookieSettings}
            className=" w-full"
          >
            <Button className="w-full" size={"sm"} variant={"outline"}>
              {t("privacyPolicy")}
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-8 w-full">
          <Button size={"sm"} onClick={handleCookiesAccept} className="w-full">
            {t("acceptAll")}
          </Button>
          <h4 className="text-2xl tracking-tighter font-bold text-gray-800">
            {t("changeAccepted")}
          </h4>
          <div className="w-full flex flex-col bg-gray-50 border-2 border-gray-100 rounded-lg">
            <div className="flex justify-between items-center w-full border-b-2 border-gray-100 p-4">
              <span className="text-sm text-gray-800">{t("necessary")}</span>
              <button
                className={`w-12 h-7 vg-gray-200 rounded-full p-1 duration-300 ease-in-out ${
                  true ? "bg-secondary" : ""
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                    true ? "translate-x-5" : ""
                  }`}
                ></div>
              </button>
            </div>
            <div className="flex justify-between items-center w-full p-4">
              <span className="text-sm text-gray-800">{t("statistics")}</span>
              <button
                className={`w-12 h-7 vg-gray-200 rounded-full p-1 duration-300 ease-in-out ${
                  cookiesAccepted.statistics ? "bg-secondary" : "bg-gray-300"
                }`}
                onClick={handleToggle("statistics")}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                    cookiesAccepted.statistics ? "translate-x-5" : ""
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cookies;
