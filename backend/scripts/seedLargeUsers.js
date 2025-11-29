import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import logger from "../src/utils/logger.js";

const MONGODB_URI = process.env.MONGODB_URI;

async function seedLarge(count = 2000) {
  await mongoose.connect(MONGODB_URI);
  try {
    logger.info({ count }, `Seeding ${count} users...`);
    // Prepare departments and roles distribution
    const departments = ["IT", "HR", "Sales", "Marketing", "Finance"];
    const roles = ["student", "instructor", "manager", "admin"];

    // Pre-hash a password to reuse for speed
    const hashed = await bcrypt.hash("123456", 10);

    const docs = [];
    for (let i = 0; i < count; i++) {
      // Weighted roles: mostly students
      const rRand = Math.random();
      let role;
      if (rRand < 0.85) role = "student";
      else if (rRand < 0.93) role = "instructor";
      else if (rRand < 0.99) role = "manager";
      else role = "admin";

      const dept = departments[i % departments.length];
      const username = `bulk_user_${i}`;
      const email = `bulk_user_${i}@example.test`;

      docs.push({
        username,
        email,
        password: hashed,
        role,
        department: dept,
      });
    }

    // Insert in batches for memory safety
    const batchSize = 1000;
    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      await User.insertMany(batch, { ordered: false });
      logger.info(
        { inserted: Math.min(i + batchSize, docs.length), total: docs.length },
        "Batch inserted"
      );
    }

    logger.info({ count }, `Large seeding complete: ${count} users added.`);
  } catch (err) {
    logger.error({ err: err.message || err }, "Error seeding large users");
  } finally {
    await mongoose.disconnect();
  }
}

// Allow count override via CLI: node scripts/seedLargeUsers.js 5000
const countArg = process.argv[2] ? Number(process.argv[2]) : undefined;
seedLarge(countArg || 2000).catch((e) => {
  logger.error({ err: e }, "Seed large users failed");
  process.exit(1);
});
