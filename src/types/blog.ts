import { Content } from "@/schemas/content";

export interface Service {
  id: string;
  parentServiceId: string | null;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogService {
  id: string;
  blogId: string;
  serviceId: string;
  blog?: Blog;
  service?: Service;
}

export interface Blog {
  id: string;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  author?: string;
  featuredImage?: string;
  translations?: BlogTranslation[];
  services?: BlogService[];
}

export interface BlogTranslation {
  id: string;
  blogId: string;
  languageCode: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  content: Content;
  keywords?: string[];
  blog?: Blog;
}

export interface CreateBlogData {
  image: string;
  order: number;
  serviceIds: string[];
  translations: CreateBlogTranslationData[];
}

export interface CreateBlogTranslationData {
  languageCode: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  keywords?: string[];
  content: Content;
}

export interface UpdateBlogData {
  image: string;
  order: number;
  serviceIds: string[];
}

export interface UpdateBlogTranslationData {
  slug?: string;
  title?: string;
  description: string;
  shortDescription: string;
  keywords?: string[];
  content: Content;
}

export interface BlogWithTranslations extends Blog {
  translations: BlogTranslation[];
}
