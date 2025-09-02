"use client";

import * as React from "react";
import { Marquee, MarqueeItem } from "@/components/atoms/marquee";
import { Card } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { ArrowUpRight } from "lucide-react";

export default function MarqueeDemo() {
  const items = [
    {
      title: "Web Dizajn",
      badge: "Popularna usluga",
      icon: <ArrowUpRight className="size-5" />,
    },
    {
      title: "Logo Dizajn",
      badge: "Novo",
      icon: <ArrowUpRight className="size-5" />,
    },
    {
      title: "SEO Optimizacija",
      badge: "Ograničeno",
      icon: <ArrowUpRight className="size-5" />,
    },
    {
      title: "Hosting Usluge",
      badge: "24/7 Podrška",
      icon: <ArrowUpRight className="size-5" />,
    },
    {
      title: "Mobilne Aplikacije",
      badge: "iOS & Android",
      icon: <ArrowUpRight className="size-5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-10 py-12">
      <h2 className="text-3xl font-bold text-center">Horizontalni Marquee</h2>
      <Marquee speed={300} pauseOnHover>
        {items.map((item, index) => (
          <MarqueeItem key={index + Math.random()} variant="default">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{item.title}</h3>
                {item.icon}
              </div>
              <Badge variant="outline">{item.badge}</Badge>
            </div>
          </MarqueeItem>
        ))}
      </Marquee>

      <h2 className="text-3xl font-bold text-center mt-10">
        Vertikalni Marquee
      </h2>
      <Marquee
        direction="vertical"
        size="lg"
        speed={1000}
        className="h-[400px]"
      >
        {items.map((item, index) => (
          <MarqueeItem key={index} variant="outline" size="sm">
            <div className="flex items-center gap-3">
              <h3 className="font-medium">{item.title}</h3>
              <Badge>{item.badge}</Badge>
              {item.icon}
            </div>
          </MarqueeItem>
        ))}
      </Marquee>

      <h2 className="text-3xl font-bold text-center mt-10">
        Obrnut i brži Marquee
      </h2>
      <Marquee speed={50} reverse pauseOnHover gap="lg">
        {items.map((item, index) => (
          <MarqueeItem key={index} variant="ghost" size="lg">
            <Card className="p-4 w-full">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-xl">{item.title}</h3>
                  {item.icon}
                </div>
                <Badge variant="secondary">{item.badge}</Badge>
              </div>
            </Card>
          </MarqueeItem>
        ))}
      </Marquee>
    </div>
  );
}
