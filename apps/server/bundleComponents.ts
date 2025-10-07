import { bundle } from "@adminjs/bundler";
import { componentLoader } from "@/routes/admin/config/componentLoader.js";

(async () => {
  try {
    await bundle({
      componentLoader,
      destinationDir: "public",
    });
  } catch (error) {
    console.error("❌ Bundling failed:", error);
    throw error;
  }
})().catch((error) => {
  console.error("❌ Error during bundling:", error);
  process.exit(1);
});
