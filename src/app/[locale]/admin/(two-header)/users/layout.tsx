import { UsersSidebar } from "@/components/organisms/admin/user/UsersSidebar";
import { getAllUsers } from "@/actions/UserActions";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getAllUsers();

  return (
    <div className="flex h-full">
      <UsersSidebar users={users} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}