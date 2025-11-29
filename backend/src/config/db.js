import mongoose from "mongoose";
import logger from "../utils/logger.js";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("Lỗi kết nối với MongoDB");
    throw err;
  }
}
