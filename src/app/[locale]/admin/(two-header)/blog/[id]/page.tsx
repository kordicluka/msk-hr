import { getBlogById } from "@/actions/BlogAction";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  const hrTranslation = blog.translations?.find((t) => t.languageCode === "hr");
  const enTranslation = blog.translations?.find((t) => t.languageCode === "en");

  return (
    <div className="h-full w-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hrTranslation?.title || "Blog bez naziva"}
          </h1>
          <p className="text-gray-600">{hrTranslation?.shortDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Osnovne informacije */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Osnovne informacije</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">ID:</span> {blog.id}
              </div>
              <div>
                <span className="font-medium">Redoslijed:</span> {blog.order}
              </div>
              <div>
                <span className="font-medium">Slika:</span> {blog.image}
              </div>
              <div>
                <span className="font-medium">Kreiran:</span>{" "}
                {new Date(blog.createdAt).toLocaleDateString("hr-HR")}
              </div>
              <div>
                <span className="font-medium">Ažuriran:</span>{" "}
                {new Date(blog.updatedAt).toLocaleDateString("hr-HR")}
              </div>
            </div>
          </div>

          {/* Statistike */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Statistike</h2>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500">
                <div className="font-medium">Dostupni prijevodi</div>
                <div className="text-sm text-gray-600">
                  {blog.translations?.length || 0} jezika
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded border-l-4 border-green-500">
                <div className="font-medium">Status</div>
                <div className="text-sm text-gray-600">
                  {blog.translations?.length === 2 ? "Kompletno" : "Nepotpuno"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prijevodi */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Prijevodi</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hrvatski prijevod */}
            {hrTranslation && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="mr-2">🇭🇷</span>
                  Hrvatski
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Naslov:</span>{" "}
                    {hrTranslation.title}
                  </div>
                  <div>
                    <span className="font-medium">URL:</span>{" "}
                    {hrTranslation.slug}
                  </div>
                  <div>
                    <span className="font-medium">Kratki opis:</span>{" "}
                    {hrTranslation.shortDescription}
                  </div>
                  <div>
                    <span className="font-medium">Opis:</span>{" "}
                    {hrTranslation.description}
                  </div>
                  {hrTranslation.content && (
                    <div>
                      <span className="font-medium">Sadržaj:</span>
                      <div
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: hrTranslation.content,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Engleski prijevod */}
            {enTranslation && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <span className="mr-2">🇬🇧</span>
                  English
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Title:</span>{" "}
                    {enTranslation.title}
                  </div>
                  <div>
                    <span className="font-medium">URL:</span>{" "}
                    {enTranslation.slug}
                  </div>
                  <div>
                    <span className="font-medium">Short description:</span>{" "}
                    {enTranslation.shortDescription}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    {enTranslation.description}
                  </div>
                  {enTranslation.content && (
                    <div>
                      <span className="font-medium">Content:</span>
                      <div
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: enTranslation.content,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Akcije */}
        <div className="mt-8 flex space-x-4">
          <Link
            href={`/admin/blog/${blog.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Uredi blog post
          </Link>
          <Link
            href="/admin/blog/table"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Povratak na tablicu
          </Link>
        </div>
      </div>
    </div>
  );
}
