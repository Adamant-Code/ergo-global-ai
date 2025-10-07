import * as bcrypt from "bcrypt";
import { AdminUser } from "@/models/AdminUser.js";

const authenticate = async (email: string, password: string) => {
  try {
    const adminUser = await AdminUser.query().findOne({ email });

    if (adminUser) {
      const passwordMatch = await bcrypt.compare(
        password,
        adminUser.password
      );

      if (passwordMatch) {
        console.log(
          `Admin user authenticated: ${email} with role ${adminUser.role}`
        );
        return {
          id: adminUser.id,
          role: adminUser.role,
          email: adminUser.email,
        };
      }
    }
    console.log(`Admin authentication failed for: ${email}`);
    return null;
  } catch (error) {
    console.error(
      `Error during admin authentication for ${email}:`,
      error
    );
    return null;
  }
};

export default authenticate;
