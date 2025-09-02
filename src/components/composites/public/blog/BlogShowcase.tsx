"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/atoms/badge";
import { ArrowButton } from "@/components/atoms/button";

interface BlogCard {
  title: string;
  excerpt: string;
  image: string;
  href: string;
  cta: string;
  category: string;
}

const AllBlogsShowcase = ({ blogs }: { blogs: BlogCard[] }) => {
  return (
    <div className="pt-6 md:pt-8 pb-16 md:pb-20 relative bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Featured Post - Left Side */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-40 lg:self-start">
            <article className="relative space-y-6 md:space-y-8 group hover:cursor-pointer">
              {/* Content */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-4 md:mb-6 leading-tight group-hover:underline">
                {blogs[0].title}
              </h1>
              <div className="relative z-10">
                <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <Badge variant="outline" className="w-fit">
                    TEHNOLOGIJA
                  </Badge>
                  <span className="text-gray-500 text-sm">
                    {blogs[0].category}
                  </span>
                  <ArrowButton
                    variant="ghost"
                    className="w-fit text-sm text-gray-700"
                  >
                    Pročitaj više
                  </ArrowButton>
                </div>
              </div>
              <div className="w-full aspect-square md:aspect-[4/3] lg:aspect-square shadow-xl rounded-xl overflow-hidden">
                <Image
                  src={blogs[0].image}
                  alt={blogs[0].title}
                  className="w-full h-full object-cover"
                  width={1000}
                  height={1000}
                />
              </div>
            </article>
          </div>

          {/* Other Posts - Right Side */}
          <div className="w-full lg:w-1/2">
            <div className="space-y-4 md:space-y-6">
              {blogs.slice(1).map((post) => (
                <BlogCard key={post.title} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Styling */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .lg\\:sticky {
          position: sticky;
        }
      `}</style>
    </div>
  );
};

const BlogCard = ({ post }: { post: BlogCard }) => {
  return (
    <article
      key={post.title}
      className="group bg-transparent border-b border-gray-200 text-gray-900 p-4 md:p-6 hover:cursor-pointer"
    >
      {" "}
      <Link href={post.href}>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex flex-col w-full sm:w-3/4 sm:pr-4 md:pr-8 lg:pr-42">
            <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-tight md:leading-12 tracking-tighter text-gray-900 mb-3 md:mb-4 group-hover:underline transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 tracking-wide text-sm md:text-base lg:text-lg mb-3 md:mb-4">
              {post.excerpt}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 md:mt-4">
              <Badge
                className="bg-transparent border-none pl-0 text-gray-600 w-fit"
                variant="secondary"
              >
                {post.category}
              </Badge>
              <span className="text-gray-600 text-xs hidden sm:block">
                {post.category}
              </span>
              <ArrowButton
                variant="ghost"
                className="w-fit text-sm text-gray-600 hover:text-gray-900"
              >
                Pročitaj više
              </ArrowButton>
            </div>
          </div>
          <div className="flex-shrink-0 w-full sm:w-1/4  sm:max-w-[200px] aspect-video sm:aspect-square">
            <Image
              src={post.image}
              className="h-full w-full rounded-lg object-cover"
              width={300}
              height={300}
              alt={post.title}
            />
          </div>
        </div>{" "}
      </Link>
    </article>
  );
};

const RecentBlogsShowcase = ({ blogs }: { blogs: BlogCard[] }) => {
  return (
    <div className="relative pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-24 lg:pb-42">
      <div className="container mx-auto px-4">
        <div className="flex flex-col pt-6 md:pt-8 lg:pt-10 gap-6 md:gap-8">
          <div className="space-y-4 md:space-y-6 w-full">
            {blogs.map((blog) => (
              <BlogCard key={blog.title} post={blog} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AllBlogsShowcase, BlogCard, RecentBlogsShowcase };
