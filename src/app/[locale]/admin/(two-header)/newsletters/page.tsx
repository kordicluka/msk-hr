import {
  getAllNewsletters,
  getNewsletterStats,
} from "@/actions/NewsletterAction";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/admin/card";
import { Button } from "@/components/atoms/admin/button";
import { Mail, Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import Link from "next/link";
import { NewsletterStatus } from "@/types/newsletter";

export default async function NewslettersPage() {
  const newsletters = await getAllNewsletters();
  const statsResult = await getNewsletterStats();

  const stats =
    statsResult.success && statsResult.data
      ? statsResult.data
      : {
          total: 0,
          subscribed: 0,
          unsubscribed: 0,
          subscriptionRate: 0,
        };

  // Najnovije pretplate
  const recentNewsletters = newsletters.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-gray-600">Upravljanje newsletter pretplatama</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/newsletters/create">
              Nova pretplata
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/newsletters/table">
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
              Ukupno pretplata
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Svi korisnici u bazi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktivne pretplate
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.subscribed}
            </div>
            <p className="text-xs text-muted-foreground">
              Pretplaćeni korisnici
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Odjavljeni</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.unsubscribed}
            </div>
            <p className="text-xs text-muted-foreground">
              Odjavljen s newslettera
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stopa pretplate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.subscriptionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Pretplaćeni od ukupno
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Najnovije pretplate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentNewsletters.length > 0 ? (
            <div className="space-y-4">
              {recentNewsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {newsletter.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(newsletter.createdAt).toLocaleDateString("hr-HR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {newsletter.status === NewsletterStatus.SUBSCRIBED ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Pretplaćen
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Odjavljen
                      </span>
                    )}
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/newsletters/${newsletter.id}/edit`}>
                        Uredi
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nema newsletter pretplata
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Počnite dodavanjem nove pretplate.
              </p>
              <div className="mt-6">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/admin/newsletters/create">
                    Nova pretplata
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
