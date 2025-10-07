import { User } from "@/components/DataTable/types";

// Helper function to generate random dates
const getRandomDate = (start: Date, end: Date): string => {
  const randomTimestamp =
    start.getTime() +
    Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTimestamp).toISOString().split("T")[0];
};

// Helper function to generate random roles
const getRandomRole = (): "admin" | "user" => {
  const roles = ["admin", "user"];
  return roles[Math.floor(Math.random() * roles.length)] as
    | "admin"
    | "user";
};

// Generate 1000 users for testing only
export const users: User[] = Array.from(
  { length: 1000 },
  (_, index) => {
    const role = getRandomRole();
    const firstName = `User${index + 1}`;
    const lastName = `Lastname${index + 1}`;
    const email = `user${index + 1}@example.com`;

    const createdAt = getRandomDate(
      new Date(2023, 0, 1),
      new Date(2025, 3, 22)
    );

    return {
      role,
      email,
      createdAt,
      id: `${index + 1}`,
      name: `${firstName} ${lastName}`,
    };
  }
);
