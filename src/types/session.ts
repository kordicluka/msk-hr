import { User } from "./user";

export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};
