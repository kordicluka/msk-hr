import { getAllUsers, getUserStats } from "@/actions/UserActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/admin/card";
import { Button } from "@/components/atoms/admin/button";
import { User, Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function UsersPage() {
  const users = await getAllUsers();
  const statsResult = await getUserStats();

  const stats =
    statsResult.success && statsResult.data
      ? statsResult.data
      : {
          total: 0,
          withEmail: 0,
          withoutEmail: 0,
          verificationRate: 0,
        };

  // Najnoviji korisnici
  const recentUsers = users.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Korisnici</h1>
          <p className="text-gray-600">Upravljanje korisničkim računima</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/users/create">
              Novi korisnik
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users/table">
              Tablični prikaz
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ukupno korisnika
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Svi korisnici u sistemu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potvrđeni email
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.withEmail}
            </div>
            <p className="text-xs text-muted-foreground">
              Korisnici s potvrđenim emailom
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nepotvrđeni</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.withoutEmail}
            </div>
            <p className="text-xs text-muted-foreground">
              Korisnici bez potvrde
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stopa potvrde</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.verificationRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Potvrđeni od ukupno</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Najnoviji korisnici
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          className="w-8 h-8 rounded-full object-cover"
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString("hr-HR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Potvrđen
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Nije potvrđen
                      </span>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${user.id}/edit`}>
                        Uredi
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nema korisnika
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Počnite dodavanjem novog korisnika.
              </p>
              <div className="mt-6">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/admin/users/create">
                    Novi korisnik
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
