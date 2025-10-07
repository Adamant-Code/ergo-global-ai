import { UserSeed } from "@/types/auth/index.js";

const defaultPassword = process.env.USER_PASSWORD || "P@ssword123";

export const users: UserSeed[] = [
  {
    email: process.env.USER_EMAIL || "devuser@example.com",
    password: defaultPassword,
  },
  {
    email: "user2@qmail.com",
    password: "P@ssword123",
  },
  {
    email: "user3@qmail.com",
    password: "P@ssword123",
  },
  {
    email: "user4@qmail.com",
    password: "P@ssword123",
  },
  {
    email: "user5@qmail.com",
    password: "P@ssword123",
  },
  {
    email: "user6@qmail.com",
    password: "P@ssword123",
  },
  {
    email: "user7@qmail.com",
    password: "P@ssword123",
  },
  {
    email: "user8@qmail.com",
    password: "P@ssword123",
  },
];
