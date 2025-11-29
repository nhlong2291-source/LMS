import connectDB from "../src/config/db.js";
import express from "express";
import supertest from "supertest";
import requestLogger from "../src/middleware/requestLogger.js";
import courseRoutes from "../src/routes/courseRoutes.js";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection failed:", err.message || err);
    process.exitCode = 2;
    return;
  }

  const server = express();
  server.use(express.json());
  server.use(requestLogger.assignRequestId);
  server.use(requestLogger.httpLogger);

  // mount the real courseRoutes
  server.use("/courses", courseRoutes);

  try {
    const res = await supertest(server)
      .get("/courses")
      .set("Accept", "application/json")
      .timeout({ response: 10000, deadline: 20000 });

    console.log("--- SMOKE /courses RESPONSE ---");
    console.log("status:", res.status);
    console.log("headers:", res.headers);
    // show first 2 items or full body if small
    try {
      const body = JSON.parse(res.text || "[]");
      console.log(
        "returned items:",
        Array.isArray(body) ? Math.min(body.length, 5) : "non-array"
      );
      console.log(
        "bodyPreview:",
        JSON.stringify(Array.isArray(body) ? body.slice(0, 5) : body, null, 2)
      );
    } catch (e) {
      console.log("body (raw):", res.text);
    }
  } catch (err) {
    console.error("Smoke request failed:", err.message || err);
    process.exitCode = 2;
  } finally {
    // close mongoose connection
    try {
      const mongoose = await import("mongoose");
      await mongoose.connection.close();
    } catch (e) {
      // ignore
    }
  }
}

run();
