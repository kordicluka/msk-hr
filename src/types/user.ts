import { Account, Session } from "@prisma/client";

export type User = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  hashedPassword?: string;
  createdAt: Date;
  updatedAt: Date;
  accounts?: Account[];
  sessions?: Session[];
};

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  image?: string;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
};
