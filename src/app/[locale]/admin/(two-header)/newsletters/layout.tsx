import { NewslettersSidebar } from "@/components/organisms/admin/newsletter/NewslettersSidebar";
import { getAllNewsletters } from "@/actions/NewsletterAction";

export default async function NewslettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newsletters = await getAllNewsletters();

  return (
    <div className="flex h-full">
      <NewslettersSidebar newsletters={newsletters} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
