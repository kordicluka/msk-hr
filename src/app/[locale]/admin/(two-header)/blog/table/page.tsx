import { getAllBlogs } from "@/actions/BlogAction";
import BlogsTable from "@/components/organisms/admin/BlogsTable";

export default async function BlogsTablePage() {
  const blogs = await getAllBlogs();

  return (
    <div className="h-full w-full p-8">
      <BlogsTable blogs={blogs} />
    </div>
  );
}
