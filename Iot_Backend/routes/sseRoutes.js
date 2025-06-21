const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { addClient, removeClient } = require("../services/sseService");
const requireRole = require("../middleware/requireRole");
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://your-production-domain.com",
];

router.get(
  "/notifications",
  requireAuth,
  (req, res) => {
    const userId = req.user.user_id;
    const origin = req.headers.origin;

    if (ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    addClient(userId, res, "notifications");

    req.on("close", () => {
      removeClient(userId, "notifications");
    });
  }
);

router.get(
  "/device-notifications",
  requireAuth,
  requireRole(["manager", "admin"]),
  (req, res) => {
    const userId = req.user.user_id;
    const origin = req.headers.origin;

    if (ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    } else {
      res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    addClient(userId, res, "device-notifications");

    req.on("close", () => {
      removeClient(userId, "device-notifications");
    });
  }
);

module.exports = router;
