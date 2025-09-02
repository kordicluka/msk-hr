import { Card, CardContent, CardHeader } from "../atoms/card";
import Image from "next/image";
import { Badge } from "../atoms/badge";
import { cn } from "@/lib/utils";
import { ArrowButton } from "../atoms/button";
import { Link } from "@/i18n/navigation";

export const ProjectCard = ({
  title,
  description,
  icon,
  badge,
  link,
}: {
  title: string;
  description: string;
  icon: string;
  badge: string;
  link: {
    cta: string;
    href: string;
  };
}) => {
  return (
    <Card
      className={cn(
        "text-gray-900 border-none bg-muted p-2 rounded-xl  h-full relative overflow-hidden"
      )}
    >
      <CardHeader className="flex justify-start  h-[60%] md:[65%] p-4 pb-0 lg:pb-0 overflow-hidden">
        <Image
          src={icon}
          alt={`${title} Icon`}
          width={2000}
          height={2000}
          className="object-cover rounded-xl  w-full h-full"
        />
      </CardHeader>

      <CardContent className="h-[40%] md:[35%]">
        <h5 className="mb-1 font-bold md:font-semibold md:mb-3">{title}</h5>
        <Badge variant="outline" className="mb-3 border-none pl-0">
          {badge}
        </Badge>
        <p className="text-gray-600 text-xs md:text-sm xl:text-base">
          {description.slice(0, 140)}...
        </p>{" "}
        <Link href={link.href as never}>
          <ArrowButton
            variant="ghost"
            className="p-0  mt-4 lg:mt-10 text-secondary font-medium"
          >
            {link.cta}
          </ArrowButton>
        </Link>
      </CardContent>
    </Card>
  );
};
