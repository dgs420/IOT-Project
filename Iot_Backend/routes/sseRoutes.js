const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const { addClient, removeClient } = require("../services/sseService");

router.get("/notifications", requireAuth, (req, res) => {
  const userId = req.user.user_id;

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  addClient(userId, res);

  req.on("close", () => {
    removeClient(userId);
  });
});

module.exports = router;
