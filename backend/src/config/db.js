import mongoose from "mongoose";

export default async function connectDB() {
  console.log("MONGODB_URI:", process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Lỗi kết nối với MongoDB", err);
    throw err;
  }
}
