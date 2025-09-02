import { Content } from "@/schemas/content";

export interface Offer {
  id: string;
  priceFrom: string;
  priceTo: string;
  icon: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  translations?: OfferTranslation[];
  services?: OfferService[];
}

export interface OfferTranslation {
  id: string;
  offerId: string;
  languageCode: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  content: Content;
  keywords?: string[];
  offer?: Offer;
}

export interface OfferService {
  id: string;
  offerId: string;
  serviceId: string;
  offer?: Offer;
  service?: Service;
}

export interface Service {
  id: string;
  parentServiceId?: string | null;
  image: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  translations?: ServiceTranslation[];
  parentService?: Service | null;
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
}

export interface CreateOfferData {
  priceFrom: string;
  priceTo: string;
  icon: string;
  order: number;
  translations: CreateOfferTranslationData[];
  serviceIds: string[];
}

export interface CreateOfferTranslationData {
  languageCode: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  keywords?: string[];
  content: Content;
}

export interface UpdateOfferData {
  priceFrom: string;
  priceTo: string;
  icon: string;
  order: number;
  serviceIds: string[];
}

export interface UpdateOfferTranslationData {
  slug?: string;
  title?: string;
  subtitle: string;
  description: string;
  keywords?: string[];
  content: Content;
}

export interface OfferWithTranslations extends Offer {
  translations: OfferTranslation[];
  services: (OfferService & {
    service: Service & {
      translations: ServiceTranslation[];
      parentService?: (Service & { translations: ServiceTranslation[] }) | null;
    };
  })[];
}
