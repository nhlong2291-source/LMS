import express from "express";
import supertest from "supertest";
import app from "../src/app.js";
import requestLogger from "../src/middleware/requestLogger.js";

async function run() {
  const server = express();
  // mount request logger so assignRequestId + morgan -> pino stream run
  server.use(requestLogger.assignRequestId);
  server.use(requestLogger.httpLogger);
  // add a small demo route that returns 200 so we can capture a successful access log
  server.get("/demo", (req, res) => {
    // log from the handler using the per-request logger (should include requestId)
    if (req.logger && typeof req.logger.info === "function") {
      req.logger.info({ event: "demo.handler" }, "demo route hit");
    } else if (req.log && typeof req.log.info === "function") {
      req.log.info({ event: "demo.handler" }, "demo route hit");
    }
    res.json({ ok: true, requestId: req.id });
  });
  // mount the exported app under root
  server.use("/", app);

  try {
    const res = await supertest(server)
      .get("/demo")
      .set("Accept", "application/json")
      .timeout({ response: 5000, deadline: 10000 });

    console.log("--- SMOKE RESPONSE ---");
    console.log("status:", res.status);
    console.log("headers:", res.headers);
    console.log("body:", res.text);
  } catch (err) {
    console.error("Smoke request failed:", err.message || err);
    process.exitCode = 2;
  }
}

run();
