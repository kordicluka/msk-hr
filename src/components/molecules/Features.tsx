import { Globe, TrendingUp, Home } from "lucide-react";
import { Card, CardContent } from "../atoms/card";
export default function Features() {
  const features = [
    {
      icon: Globe,
      title: "Comprehensive Features",
      description:
        "Access a wide range of features designed to meet your business needs, from website building tools to marketing integrations.",
    },
    {
      icon: TrendingUp,
      title: "Scalability",
      description:
        "Grow your business with ease by leveraging flexible plans and scalable solutions that adapt to your evolving requirements.",
    },
    {
      icon: Home,
      title: "Professional Support",
      description:
        "Receive dedicated support from our team of experts who are committed to helping you succeed every step of the way.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-white/10 rounded-xs border-white/0 hover:border-white/10 transition-colors"
          >
            <CardContent className="p-8">
              <div className="mb-6 p-4 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <feature.icon
                  strokeWidth={1.3}
                  className="w-8 h-8 text-white"
                />
              </div>
              <h6 className="font-semibold mb-4 text-white">{feature.title}</h6>
              <p className="text-zinc-400 leading-relaxed text-sm">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
