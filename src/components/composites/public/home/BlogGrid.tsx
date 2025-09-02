// components/BlogGrid.tsx
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowButton } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/atoms/card";
import { cn } from "@/lib/utils";
import { SectionTitle } from "@/components/molecules/SectionTitle";
import { BlogWithTranslations } from "@/types/blog";
import { getUrl } from "@/lib/s3";

export default function RecentBlogPosts({
  title,
  description,
  blogs,
  ctaText,
  cardCtaText,
}: {
  blogs: BlogWithTranslations[];
  title: string;
  description: string;
  ctaText: string;
  cardCtaText: string;
}) {
  return (
    <section className="bg-black py-16 md:py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={<h2 className="text-white font-medium">{title}</h2>}
          description={
            <p className="text-sm md:text-base lg:text-lg xl:text-xl leading-6 md:leading-8 max-w-3xl font-light text-gray-200">
              {description}
            </p>
          }
          alignment="left"
          spacing="xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-10">
          {blogs.map((blog) => (
            <BlogPostCard key={blog.id} post={blog} cardCtaText={cardCtaText} />
          ))}
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link href="/blog">
            <ArrowButton
              className="mt-4 text-white hover:bg-transparent border-white bg-transparent"
              variant="outline"
            >
              {ctaText}
            </ArrowButton>
          </Link>
        </div>
      </div>
    </section>
  );
}

const BlogPostCard = ({
  post,
  cardCtaText,
}: {
  post: BlogWithTranslations;
  cardCtaText: string;
}) => {
  return (
    <Card
      className={cn(
        "text-white bg-transparent border-gray-500 p-2 h-[35rem] md:h-[40rem] rounded-xl relative overflow-hidden"
      )}
    >
      <CardHeader className="flex justify-start h-[55%] p-2 md:p-4 pb-0 overflow-hidden">
        <Image
          src={getUrl(post.image)}
          alt={`${post.translations[0].title} Blog Post`}
          width={500}
          height={500}
          className="object-cover w-full h-full rounded-lg"
        />
      </CardHeader>
      {/* */}

      <CardContent className="h-[45%] p-2 md:p-4">
        <h3 className="text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4 leading-tight">
          {post.translations[0].title}
        </h3>
        <p className="text-gray-300 text-sm md:text-base lg:text-lg font-light mb-3">
          {post.translations[0].shortDescription.slice(0, 80)}...
        </p>
        <Link href={`/blog/${post.translations[0].slug}` as never}>
          <ArrowButton
            variant="ghost"
            className="p-0 mt-2 md:mt-3 text-white underline font-medium hover:bg-transparent text-sm md:text-base"
          >
            {cardCtaText}
          </ArrowButton>
        </Link>
      </CardContent>
    </Card>
  );
};
