# www.msk.hr - Website

🌐 **Live Website**: [https://msk.hr/](https://msk.hr/)

A modern, multilingual website for my business that specializes in web development, graphic design, access control systems, and custom software solutions.

## 🚀 Features

- **Multilingual**: Croatian (HR) and English (EN) support with next-intl
- **Modern Stack**: Next.js 15 with App Router and React 19
- **Type Safety**: Full TypeScript implementation with Prisma ORM
- **Authentication**: Secure admin panel with NextAuth.js
- **Content Management**: Hierarchical services structure with dynamic routing
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Database**: PostgreSQL with comprehensive relations and translations
- **File Upload**: AWS S3 integration for image management
- **SEO Optimized**: Dynamic meta tags and sitemap generation

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **Database**: PostgreSQL + Prisma
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Internationalization**: next-intl
- **Deployment**: VPS, GitHub Actions CI/CD

## 📁 Project Structure

```
src/
├── actions/          # Server Actions for data operations
├── app/             # Next.js App Router pages
├── components/      # Atomic Design components (atoms/molecules/organisms)
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization configuration
├── lib/             # Utility libraries and configurations
├── schemas/         # Zod validation schemas
├── types/           # TypeScript type definitions
└── styles/          # Global styles and CSS modules
```

## 🗄️ Database Schema

The application uses a hierarchical content model:

- **Services** → **ServiceTranslations** (multilingual content)
- **Offers** → **OfferTranslations** (service packages)
- **Projects** → **ProjectTranslations** (portfolio items)
- **Blog** → **BlogTranslations** (blog posts)
- **Users** & **Authentication** (admin access)

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd website
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Fill in your database and AWS credentials
   ```

4. **Set up the database**

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 📝 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Admin Panel

- Content management for services, projects, offers, and blog posts
- Multi-language content editing
- Image upload to AWS S3
- User management

### Public Website

- Responsive design for all devices
- Dynamic routing for services and sub-services
- Portfolio showcase with filtering
- Contact forms and newsletter signup
- SEO-optimized pages with dynamic meta tags

### Internationalization

- Support for Croatian and English
- Dynamic routing with locale prefixes
- Translated content management

## Security

- NextAuth.js for authentication
- bcrypt for password hashing
- Protected admin routes with middleware
- Type-safe database queries with Prisma
- Input validation with Zod schemas
