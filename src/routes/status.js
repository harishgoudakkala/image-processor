import express from "express";
import Request from "../models/Request.js";

const router = express.Router();

router.get("/:requestId", async (req, res) => {
  const request = await Request.findOne({ requestId: req.params.requestId });
  if (!request) return res.status(404).json({ error: "Request not found" });

  res.json(request);
});

export default router;
