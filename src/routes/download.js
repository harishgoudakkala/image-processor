import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/:requestId", (req, res) => {
  const filePath = path.join("output", `${req.params.requestId}.csv`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "CSV file not found" });
  }

  res.download(filePath);
});

export default router;
