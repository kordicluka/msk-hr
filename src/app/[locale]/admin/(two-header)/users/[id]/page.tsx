import { getUserById } from "@/actions/UserActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/admin/card";
import { Button } from "@/components/atoms/admin/button";
import { Badge } from "@/components/atoms/badge";
import { User, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-2" />
            {user.name || "N/A"}
          </h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`/admin/users/${user.id}/edit`}>
              <Settings className="h-4 w-4 mr-2" />
              Uredi
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Osnovne informacije</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Ime</label>
              <p className="text-sm text-gray-900">{user.name || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Email adresa
              </label>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Email status
              </label>
              <div className="mt-1">
                {user.emailVerified ? (
                  <Badge className="bg-green-100 text-green-800">
                    Potvrđen
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Nije potvrđen
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Domena
              </label>
              <p className="text-sm text-gray-900">
                {user.email.split("@")[1]}
              </p>
            </div>
            {user.image && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Slika
                </label>
                <div className="mt-1">
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-16 h-16 rounded-full object-cover"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Vremenske informacije
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Registrovan
              </label>
              <p className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString("hr-HR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Zadnje ažuriranje
              </label>
              <p className="text-sm text-gray-900">
                {new Date(user.updatedAt).toLocaleDateString("hr-HR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {user.emailVerified && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email potvrđen
                </label>
                <p className="text-sm text-gray-900">
                  {new Date(user.emailVerified).toLocaleDateString("hr-HR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">
                Član od
              </label>
              <p className="text-sm text-gray-900">
                {Math.floor(
                  (Date.now() - new Date(user.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                dana
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Stats */}
      {(user.accounts && user.accounts.length > 0) ||
        (user.sessions && user.sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Račun statistike</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.accounts && user.accounts.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Povezani računi
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.accounts.length} račun(a)
                  </p>
                </div>
              )}
              {user.sessions && user.sessions.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Aktivne sesije
                  </label>
                  <p className="text-sm text-gray-900">
                    {user.sessions.length} sesija
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Akcije</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={`/admin/users/${user.id}/edit`}>
                <Settings className="h-4 w-4 mr-2" />
                Uredi korisnika
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/users/table">
                Nazad na listu
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
