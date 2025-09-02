import { Content } from "@/schemas/content";

export interface Service {
  id: string;
  parentServiceId?: string | null;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  parentService?: Service | null;
  childServices?: Service[];
  translations?: ServiceTranslation[];
}

export interface ServiceTranslation {
  id: string;
  serviceId: string;
  languageCode: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  content: Content;
  keywords?: string[];
  service?: Service;
}

export interface CreateServiceData {
  parentServiceId?: string;
  image: string;
  order: number;
  translations: CreateServiceTranslationData[];
}

export interface CreateServiceTranslationData {
  languageCode: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  keywords?: string[];
  content: Content;
}

export interface UpdateServiceData {
  parentServiceId?: string;
  image: string;
  order: number;
}

export interface UpdateServiceTranslationData {
  slug?: string;
  title?: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  keywords?: string[];
  content: Content;
}

export interface ServiceWithTranslations extends Service {
  translations: ServiceTranslation[];
}

export interface ServiceHierarchy extends Service {
  parentService?: ServiceHierarchy | null;
  childServices: ServiceHierarchy[];
}
