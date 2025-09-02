import { getBlogById } from "@/actions/BlogAction";
import { getAllServices } from "@/actions/ServiceAction";
import { BlogForm } from "@/components/organisms/admin/blog/form/BlogForm";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const currentLocale = locale as "hr" | "en";

  const blog = await getBlogById(id);
  const services = await getAllServices(currentLocale);

  if (!blog) {
    notFound();
  }

  return <BlogForm blog={blog} services={services} />;
}
