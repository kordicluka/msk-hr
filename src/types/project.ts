import { Content } from "@/schemas/content";

export interface Project {
  id: string;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  featuredImage?: string;
  translations?: ProjectTranslation[];
  services?: ProjectService[];
}

export interface ProjectTranslation {
  id: string;
  projectId: string;
  languageCode: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  content: Content;
  keywords?: string[];
  project?: Project;
}

export interface ProjectService {
  id: string;
  projectId: string;
  serviceId: string;
  project?: Project;
  service?: {
    id: string;
    translations?: Array<{
      languageCode: string;
      title: string;
    }>;
  };
}

export interface CreateProjectData {
  image: string;
  order: number;
  serviceIds: string[];
  translations: CreateProjectTranslationData[];
}

export interface CreateProjectTranslationData {
  languageCode: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  keywords?: string[];
  content: Content;
}

export interface UpdateProjectData {
  image: string;
  order: number;
  serviceIds?: string[];
}

export interface UpdateProjectTranslationData {
  slug?: string;
  title?: string;
  description: string;
  shortDescription: string;
  keywords?: string[];
  content: Content;
}

export interface ProjectWithTranslations extends Project {
  translations: ProjectTranslation[];
  services: ProjectService[];
}
