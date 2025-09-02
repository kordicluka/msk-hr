import { BlogForm } from "@/components/organisms/admin/blog/form/BlogForm";
import { getAllServices } from "@/actions/ServiceAction";

export default async function CreateBlogPage() {
  const services = await getAllServices("hr");
  return <BlogForm services={services} />;
}
