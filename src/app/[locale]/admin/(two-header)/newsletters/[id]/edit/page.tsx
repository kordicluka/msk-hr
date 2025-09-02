import { getNewsletterById } from "@/actions/NewsletterAction";
import { NewsletterForm } from "@/components/organisms/admin/newsletter/form/NewsletterForm";
import { notFound } from "next/navigation";

interface EditNewsletterPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsletterPage({
  params,
}: EditNewsletterPageProps) {
  const { id } = await params;
  const newsletter = await getNewsletterById(id);

  if (!newsletter) {
    notFound();
  }

  return (
    <div className="p-6">
      <NewsletterForm newsletter={newsletter} />
    </div>
  );
}
