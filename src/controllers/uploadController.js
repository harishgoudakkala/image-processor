import csv from "csv-parser";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Request from "../models/Request.js";
import { addToQueue } from "../workers/imageWorker.js";

export const handleUpload = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
    const requestId = uuidv4();
    const results = [];
  
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        fs.unlinkSync(req.file.path);

    const requestData = {
        requestId,
        status: "processing",
        webhookUrl: req.body.webhookUrl,
        products: results.map((row, index) => ({
        serialNumber: row["S. No."] || index+1,
        productName: row["Product Name"],
        inputImages: row["Input Image Urls"].split(",").map((url) => url.trim()),
        outputImages: [],
        })),
    };

    await Request.create(requestData);
    addToQueue(requestId, requestData.products);
    res.json({ requestId });
    });
}