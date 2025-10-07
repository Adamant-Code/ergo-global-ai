import "dotenv/config";
import * as bcrypt from "bcrypt";
import db from "@/config/objection.js";
import { User } from "../src/models/User.js";
import { users } from "../src/constants/user.js";
import { AdminUser } from "../src/models/AdminUser.js";
import { adminUsers } from "../src/constants/adminUsers.js";

async function main() {
  console.log("Start seeding...");
  const userPassword = process.env.USER_PASSWORD;
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!userPassword || !adminPassword) {
    console.error(
      "USER_PASSWORD and SUPER_ADMIN_PASSWORD must be set in .env file"
    );
    process.exit(1);
  }

  const [existingUsers, existingAdmins] = await Promise.all([
    User.query(),
    AdminUser.query(),
  ]);

  if (existingUsers.length < 1) await createUsers();
  else
    console.log(
      `${existingUsers.length} user${
        existingUsers.length > 1 ? "s" : ""
      } already exist, skipping creation.`
    );

  if (existingAdmins.length < 1) await createAdmins();
  else
    console.log(
      `${existingAdmins.length} admin user${
        existingAdmins.length > 1 ? "s" : ""
      } already exist, skipping creation.`
    );

  await db.destroy();
}

async function createUsers() {
  try {
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await db.transaction(async (trx) => {
      const insertedUsers: User[] = [];
      for (const user of hashedUsers) {
        try {
          const inserted = await User.query(trx).insert(user);
          insertedUsers.push(inserted);
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "23505"
          ) {
            console.log(
              `User with email ${user.email} already exists, skipping.`
            );
          } else {
            throw error;
          }
        }
      }
      console.log(
        `Successfully loaded ${insertedUsers.length} users.`
      );
    });
  } catch (error) {
    console.error("Error loading users:", error);
  }
}

async function createAdmins() {
  try {
    const hashedAdmins = await Promise.all(
      adminUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    await db.transaction(async (trx) => {
      const insertedAdmins: AdminUser[] = [];
      for (const admin of hashedAdmins) {
        try {
          const inserted = await AdminUser.query(trx).insert(admin);
          insertedAdmins.push(inserted);
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "23505"
          ) {
            console.log(
              `Admin with email ${admin.email} already exists, skipping.`
            );
          } else {
            throw error;
          }
        }
      }
      console.log(
        `Successfully created ${insertedAdmins.length} admin users.`
      );
    });
  } catch (error) {
    console.error("Error creating admin users:", error);
  }
}

main().catch((e) => {
  console.error("Error during seeding:", e);
  process.exit(1);
});
