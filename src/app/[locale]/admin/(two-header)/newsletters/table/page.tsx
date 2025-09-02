import { getAllNewsletters } from "@/actions/NewsletterAction";
import NewslettersTable from "@/components/organisms/admin/NewslettersTable";

export default async function NewslettersTablePage() {
  const newsletters = await getAllNewsletters();

  return (
    <div className="p-6">
      <NewslettersTable newsletters={newsletters} />
    </div>
  );
}
