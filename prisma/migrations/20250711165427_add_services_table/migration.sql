-- CreateEnum
CREATE TYPE "NewsletterStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "parent_service_id" TEXT,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_translations" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "service_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL,
    "price_from" TEXT NOT NULL,
    "price_to" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_translations" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "offer_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer_services" (
    "id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "offer_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_translations" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "project_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_services" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "project_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_translations" (
    "id" TEXT NOT NULL,
    "blog_id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "blog_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletters" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'SUBSCRIBED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_services" (
    "id" TEXT NOT NULL,
    "blog_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "blog_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "service_translations_service_id_language_code_key" ON "service_translations"("service_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "service_translations_slug_language_code_key" ON "service_translations"("slug", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "offer_translations_offer_id_language_code_key" ON "offer_translations"("offer_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "offer_translations_slug_language_code_key" ON "offer_translations"("slug", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "offer_services_offer_id_service_id_key" ON "offer_services"("offer_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "project_translations_project_id_language_code_key" ON "project_translations"("project_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "project_translations_slug_language_code_key" ON "project_translations"("slug", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "project_services_project_id_service_id_key" ON "project_services"("project_id", "service_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_translations_blog_id_language_code_key" ON "blog_translations"("blog_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "blog_translations_slug_language_code_key" ON "blog_translations"("slug", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "newsletters_email_key" ON "newsletters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "blog_services_blog_id_service_id_key" ON "blog_services"("blog_id", "service_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_parent_service_id_fkey" FOREIGN KEY ("parent_service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_translations" ADD CONSTRAINT "service_translations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_translations" ADD CONSTRAINT "offer_translations_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_services" ADD CONSTRAINT "offer_services_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "offer_services" ADD CONSTRAINT "offer_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_services" ADD CONSTRAINT "project_services_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_services" ADD CONSTRAINT "project_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_translations" ADD CONSTRAINT "blog_translations_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_services" ADD CONSTRAINT "blog_services_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_services" ADD CONSTRAINT "blog_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
