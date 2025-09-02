import { getAllBlogs } from "@/actions/BlogAction";
import { BlogsSidebar } from "@/components/organisms/admin/blog/BlogsSidebar";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogs = await getAllBlogs();

  return (
    <div className="flex flex-1">
      <BlogsSidebar blogs={blogs} />
      <div className="flex-1 bg-white overflow-y-auto h-[calc(100vh-3.75rem)]">
        {children}
      </div>
    </div>
  );
}
