import { getUserById } from "@/actions/UserActions";
import { UserForm } from "@/components/organisms/admin/user/form/UserForm";
import { notFound } from "next/navigation";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({
  params,
}: EditUserPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6">
      <UserForm user={user} />
    </div>
  );
}