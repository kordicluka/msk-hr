import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { contactData } from "@/data/contactData";

export const alt =
  "MSK - Web Design, Software Development, Graphic Design & Access Control";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Button stilovi - isti kao u opengraph-image.tsx
const buttonStyles = {
  primary: {
    backgroundColor: "#001e2b",
    color: "white",
    borderRadius: "50px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "12px",
    paddingBottom: "12px",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "8px",
    border: "1px solid #001e2b",
    fontFamily: "Inter, sans-serif",
  },
  secondary: {
    backgroundColor: "#155dfc",
    color: "white",
    borderRadius: "50px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "12px",
    paddingBottom: "12px",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "8px",
    border: "1px solid #155dfc",
    fontFamily: "Inter, sans-serif",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#001e2b",
    borderRadius: "50px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "12px",
    paddingBottom: "12px",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "8px",
    border: "2px solid #001e2b",
    fontFamily: "Inter, sans-serif",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#001e2b",
    borderRadius: "50px",
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: "12px",
    paddingBottom: "12px",
    fontSize: "16px",
    fontWeight: "500",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "8px",
    border: "none",
    fontFamily: "Inter, sans-serif",
  },
};

export default async function Image({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "opengraph",
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* Logo Container */}
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="200"
            height="72"
            viewBox="0 0 372 138"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M299.535 111.643L299.8 68.1524H304.574L329.236 33.9436H370.339L328.971 87.2457H318.629L299.535 111.643ZM266.652 135.774V0H303.248V135.774H266.652ZM329.501 135.774L306.165 95.4664L330.031 69.4783L371.4 135.774H329.501Z"
              fill="#001e2b"
            />
            <path
              d="M259.314 67.0912H225.636C225.459 65.0139 224.73 63.2239 223.448 61.7212C222.167 60.2185 220.509 59.0693 218.476 58.2738C216.487 57.434 214.277 57.0142 211.846 57.0142C208.708 57.0142 206.012 57.5887 203.758 58.7379C201.504 59.887 200.399 61.5223 200.444 63.6438C200.399 65.1465 201.04 66.5387 202.366 67.8204C203.736 69.1022 206.366 70.0966 210.255 70.8038L230.94 74.5163C241.37 76.4168 249.127 79.6211 254.21 84.1293C259.337 88.5932 261.922 94.582 261.966 102.096C261.922 109.344 259.756 115.642 255.469 120.99C251.226 126.294 245.414 130.404 238.033 133.321C230.697 136.194 222.321 137.63 212.907 137.63C197.35 137.63 185.173 134.448 176.378 128.084C167.627 121.719 162.743 113.322 161.727 102.891H198.057C198.543 106.118 200.134 108.615 202.83 110.383C205.57 112.106 209.018 112.968 213.172 112.968C216.531 112.968 219.294 112.394 221.459 111.244C223.669 110.095 224.796 108.46 224.84 106.338C224.796 104.394 223.824 102.847 221.923 101.698C220.067 100.549 217.15 99.6205 213.172 98.9133L195.14 95.7311C184.753 93.919 176.975 90.4716 171.804 85.3889C166.632 80.3062 164.069 73.765 164.113 65.7653C164.069 58.6937 165.925 52.7049 169.682 47.799C173.483 42.8489 178.897 39.0921 185.925 36.5287C192.996 33.921 201.372 32.6172 211.051 32.6172C225.769 32.6172 237.37 35.6668 245.856 41.7661C254.386 47.8653 258.873 56.307 259.314 67.0912Z"
              fill="#001e2b"
            />
            <path
              d="M0 135.774V33.9431H34.7392V53.3016H35.7999C37.9214 46.9372 41.5456 41.8986 46.6725 38.1861C51.7994 34.4735 57.8986 32.6172 64.9702 32.6172C72.1302 32.6172 78.2957 34.5177 83.4668 38.3187C88.6379 42.0754 91.7539 47.0697 92.8146 53.3016H93.8753C95.599 47.0697 99.2674 42.0754 104.881 38.3187C110.494 34.5177 117.079 32.6172 124.637 32.6172C134.404 32.6172 142.316 35.7552 148.371 42.0312C154.47 48.3073 157.52 56.6606 157.52 67.0912V135.774H120.924V76.3726C120.924 71.9087 119.797 68.4171 117.543 65.8979C115.289 63.3344 112.261 62.0527 108.46 62.0527C104.704 62.0527 101.72 63.3344 99.5105 65.8979C97.3448 68.4171 96.262 71.9087 96.262 76.3726V135.774H61.2576V76.3726C61.2576 71.9087 60.1306 68.4171 57.8765 65.8979C55.6225 63.3344 52.5949 62.0527 48.794 62.0527C46.2747 62.0527 44.109 62.6272 42.2969 63.7764C40.4848 64.9255 39.0705 66.5829 38.054 68.7486C37.0816 70.8701 36.5955 73.4114 36.5955 76.3726V135.774H0Z"
              fill="#001e2b"
            />
          </svg>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            textAlign: "left",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {/* Main Title - malo manji za Twitter */}
          <h2
            style={{
              fontSize: "58px", // malo manji od OG
              fontWeight: "700",
              color: "#000000",
              marginBottom: "50px",
              letterSpacing: "-0.025em",
              lineHeight: "1.1",
              textAlign: "left",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {t("subtitle")}
          </h2>

          {/* Contact Info - kompaktniji layout za Twitter */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px", // malo manji gap
              marginBottom: "30px",
            }}
          >
            {/* Phone Button */}
            <div style={buttonStyles.secondary}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {contactData.telephone}
            </div>

            {/* Email Button */}
            <div style={buttonStyles.ghost}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
              {contactData.email}
            </div>
          </div>
        </div>

        {/* Website URL */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "80px",
            fontSize: "18px", // malo manji
            color: "#000000",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {t("website")}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
