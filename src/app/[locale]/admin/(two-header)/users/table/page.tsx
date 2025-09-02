import { getAllUsers } from "@/actions/UserActions";
import UsersTable from "@/components/organisms/admin/UsersTable";

export default async function UsersTablePage() {
  const users = await getAllUsers();

  return (
    <div className="p-6">
      <UsersTable users={users} />
    </div>
  );
}