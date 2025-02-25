import express from "express";
import Request from "../models/Request.js";
import { Parser } from "json2csv";

const router = express.Router();

router.get("/:requestId", async (req, res) => {
  try {
    const request = await Request.findOne({ requestId: req.params.requestId });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "completed") {
      return res.status(400).json({ error: "CSV file is not available until the request is completed" });
    }

    const csvFields = ["S. No.", "Product Name", "Input Images", "Output Images"];
    const csvData = request.products.map((product, index) => ({
      "S. No.": index + 1,
      "Product Name": product.productName,
      "Input Images": product.inputImages.join(" | "),
      "Output Images": product.outputImages.join(" | "),
    }));

    const parser = new Parser({ fields: csvFields });
    const csv = parser.parse(csvData);

    res.setHeader("Content-Disposition", `attachment; filename=${req.params.requestId}.csv`);
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
