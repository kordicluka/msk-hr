export enum NewsletterStatus {
  SUBSCRIBED = "SUBSCRIBED",
  UNSUBSCRIBED = "UNSUBSCRIBED",
}

export interface Newsletter {
  id: string;
  email: string;
  status: NewsletterStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNewsletterData {
  email: string;
  status?: NewsletterStatus;
}

export interface UpdateNewsletterData {
  email?: string;
  status?: NewsletterStatus;
}

export interface NewsletterSubscribeData {
  email: string;
}
