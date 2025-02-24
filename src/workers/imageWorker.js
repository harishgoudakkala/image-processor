import { Queue, Worker } from "bullmq";
import axios from "axios";
import { generateCSV } from "../services/generateCSV.js";
import Request from "../models/Request.js";
import { processImage } from "../services/imageProcessor.js";
import redis from "../config/redis.js";

const redisConfig = {
  connection: redis.options, 
};

const imageQueue = new Queue("imageProcessing", redisConfig);

new Worker(
  "imageProcessing",
  async (job) => {
    const { requestId, product } = job.data;

    const outputImages = await Promise.all(
      product.inputImages.map((url) => processImage(url))
    );

    await Request.updateOne(
      { requestId, "products.productName": product.productName },
      { $set: { "products.$.outputImages": outputImages } }
    );

    const request = await Request.findOne({ requestId });
    if (!request) return;

    const isCompleted = request.products.every(
      (p) => p.outputImages.length === p.inputImages.length
    );

    if (isCompleted) {
      request.status = "completed";
      await request.save();

      const csvFilePath = await generateCSV(request);
      console.log(`CSV File Generated: ${csvFilePath}`);

      request.csvFilePath =  `http://localhost:5000/download/${requestId}`;
      await request.save();

      if (request.webhookUrl) {
        axios
          .post(request.webhookUrl, {
            requestId,
            status: "completed",
            products: request.products,
            csvDownloadUrl: `http://localhost:5000/download/${requestId}`,
          })
          .then(() => console.log(`Webhook sent successfully for requestId: ${requestId}`))
          .catch((err) => console.error(`Failed to send webhook for requestId: ${requestId}`, err));
      }
    }
  },
  redisConfig
);

export const addToQueue = async (requestId, products) => {
  products.forEach((product) => {
    imageQueue.add("processImage", { requestId, product });
  });
};

export default imageQueue;
