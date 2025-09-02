import { getProjectById } from "@/actions/ProjectAction";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const hrTranslation = project.translations?.find(
    (t) => t.languageCode === "hr"
  );
  const enTranslation = project.translations?.find(
    (t) => t.languageCode === "en"
  );

  return (
    <div className="h-full w-full p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hrTranslation?.title || "Projekt bez naziva"}
          </h1>
          <p className="text-gray-600">{hrTranslation?.shortDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Osnovne informacije */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Osnovne informacije</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">ID:</span> {project.id}
              </div>
              <div>
                <span className="font-medium">Redoslijed:</span> {project.order}
              </div>
              <div>
                <span className="font-medium">Slika:</span> {project.image}
              </div>
              <div>
                <span className="font-medium">Kreiran:</span>{" "}
                {new Date(project.createdAt).toLocaleDateString("hr-HR")}
              </div>
              <div>
                <span className="font-medium">Ažuriran:</span>{" "}
                {new Date(project.updatedAt).toLocaleDateString("hr-HR")}
              </div>
            </div>
          </div>

          {/* Povezane usluge */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Povezane usluge</h2>
            <div className="space-y-2">
              {project.services?.map((ps) => {
                const serviceTranslation = ps.service?.translations?.find(
                  (t) => t.languageCode === "hr"
                );
                return (
                  <div
                    key={ps.id}
                    className="p-2 bg-gray-50 rounded border-l-4 border-blue-500"
                  >
                    <div className="font-medium">
                      {serviceTranslation?.title || "Nepoznata usluga"}
                    </div>
                  </div>
                );
              })}
              {(!project.services || project.services.length === 0) && (
                <p className="text-gray-500">Nema povezanih usluga</p>
              )}
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
            href={`/admin/projects/${project.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Uredi projekt
          </Link>
          <Link
            href="/admin/projects/table"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Povratak na tablicu
          </Link>
        </div>
      </div>
    </div>
  );
}
