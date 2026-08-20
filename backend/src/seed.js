import mongoose from "mongoose";
import env from "./config/env.js";
import User from "./models/User.js";
import Category from "./models/Category.js";

const run = async () => {
  await mongoose.connect(env.mongoUri);

  const email = (process.env.ADMIN_EMAIL || "admin@odega.uz").toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Super admin already exists: ${email}`);
  } else {
    await User.create({
      name: process.env.ADMIN_NAME || "Super Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "admin12345",
      role: "superadmin",
      isActive: true,
    });
    console.log(`Super admin created: ${email}`);
  }

  if ((await Category.countDocuments()) === 0) {
    await Category.create([
      { name: "Elektronika", slug: "elektronika", description: "Elektron qurilmalar" },
      { name: "Kiyim-kechak", slug: "kiyim-kechak", description: "Kiyim va aksessuarlar" },
      { name: "Maishiy texnika", slug: "maishiy-texnika", description: "Maishiy texnika mahsulotlari" },
    ]);
    console.log("Sample categories created");
  }

  await mongoose.disconnect();
  console.log("Seed completed");
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});