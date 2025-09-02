import { getNewsletterById } from "@/actions/NewsletterAction";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/admin/card";
import { Button } from "@/components/atoms/admin/button";
import { Badge } from "@/components/atoms/badge";
import { Mail, Calendar, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsletterStatus } from "@/types/newsletter";

interface NewsletterPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsletterPage({ params }: NewsletterPageProps) {
  const { id } = await params;
  const newsletter = await getNewsletterById(id);

  if (!newsletter) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Mail className="h-6 w-6 mr-2" />
            {newsletter.email}
          </h1>
          <p className="text-gray-600 mt-1">Newsletter pretplata</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
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
              <label className="text-sm font-medium text-gray-500">
                Email adresa
              </label>
              <p className="text-sm text-gray-900">{newsletter.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <div className="mt-1">
                {newsletter.status === NewsletterStatus.SUBSCRIBED ? (
                  <Badge className="bg-green-100 text-green-800">
                    Pretplaćen
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Odjavljen</Badge>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Domena
              </label>
              <p className="text-sm text-gray-900">
                {newsletter.email.split("@")[1]}
              </p>
            </div>
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
                Pretplaćen
              </label>
              <p className="text-sm text-gray-900">
                {new Date(newsletter.createdAt).toLocaleDateString("hr-HR", {
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
                {new Date(newsletter.updatedAt).toLocaleDateString("hr-HR", {
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
                Aktivan od
              </label>
              <p className="text-sm text-gray-900">
                {Math.floor(
                  (Date.now() - new Date(newsletter.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                dana
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Akcije</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
                <Settings className="h-4 w-4 mr-2" />
                Uredi pretplatu
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/newsletters/table">
                Nazad na listu
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
