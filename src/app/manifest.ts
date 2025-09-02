import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "msk",
    short_name: "msk",
    description:
      "Specijalizirani smo za izradu modernih web stranica, razvoj prilagođenih softverskih rješenja i prepoznatljiv grafički dizajn. Također implementiramo sustave kontrole pristupa za poslovne prostore i objekte. Sve usluge pružamo pod jednim krovom – za bržu i učinkovitiju realizaciju vaših ideja.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
