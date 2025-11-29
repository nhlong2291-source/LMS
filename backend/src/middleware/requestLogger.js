import morgan from "morgan";
import logger from "../utils/logger.js";
import { randomUUID } from "crypto";

// Assign a correlation id to each request (X-Request-Id)
export function assignRequestId(req, res, next) {
  try {
    const headerId = req.headers["x-request-id"] || req.headers["X-Request-Id"];
    const id =
      headerId ||
      (randomUUID ? randomUUID() : `${Date.now()}-${Math.random()}`);
    req.id = id;
    res.setHeader("X-Request-Id", id);
    // create a child logger scoped to this request so internal logs include requestId
    try {
      const child = logger.child({ requestId: id });
      // common conventions
      req.logger = child;
      req.log = child;
      res.locals.logger = child;
    } catch (childErr) {
      // if child creation fails, keep using root logger
      req.logger = logger;
      req.log = logger;
      res.locals.logger = logger;
    }
  } catch (e) {
    // fallback: do not throw
    req.id = `${Date.now()}-${Math.random()}`;
    res.setHeader("X-Request-Id", req.id);
  }
  next();
}

// morgan token to expose request id
morgan.token("id", function getId(req) {
  return req.id || "-";
});

// Stream morgan output into pino structured logger
// Stream morgan output into pino structured logger. We expect the morgan format
// function below to emit a JSON string so we can parse it and pass a proper
// object to pino (fields will be searchable/parsible).
const stream = {
  write: (message) => {
    const trimmed = message.trim();
    try {
      const obj = JSON.parse(trimmed);
      // Log the object fields directly so pino emits structured JSON
      logger.info(obj);
    } catch (e) {
      // Fallback: preserve old behaviour if parsing fails
      logger.info({ access: trimmed });
    }
  },
};

// morgan format function that returns a JSON string of individual fields
const jsonFormat = function (tokens, req, res) {
  const val = {
    requestId: tokens.id(req, res),
    remoteAddr: tokens["remote-addr"](req, res),
    remoteUser: tokens["remote-user"](req, res),
    date: tokens.date(req, res, "iso"),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    httpVersion: tokens["http-version"](req, res),
    status: Number(tokens.status(req, res) || 0),
    resContentLength: Number(tokens.res(req, res, "content-length") || 0),
    responseTimeMs: Number(tokens["response-time"](req, res) || 0),
    referrer: tokens.referrer(req, res),
    userAgent: tokens["user-agent"](req, res),
  };
  return JSON.stringify(val);
};

export const httpLogger = morgan(jsonFormat, { stream });

export default { assignRequestId, httpLogger };
