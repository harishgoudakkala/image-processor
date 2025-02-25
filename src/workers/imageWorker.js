import PQueue from "p-queue";
import axios from "axios";
import { generateCSV } from "../services/generateCSV.js";
import Request from "../models/Request.js";
import { processImage } from "../services/imageProcessor.js";

const queue = new PQueue({ concurrency: 5 });

export const addToQueue = async (requestId, products) => {
  products.forEach((product) => {
    queue.add(async () => {
      console.log(`Processing ${product.productName}...`);

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

        request.csvFilePath = `https://image-processor-six.vercel.app/download/${requestId}`;
        await request.save();

        if (request.webhookUrl) {
          axios
            .post(request.webhookUrl, {
              requestId,
              status: "completed",
              products: request.products,
              csvDownloadUrl: `https://image-processor-six.vercel.app/download/${requestId}`,
            })
            .then(() => console.log(`✅ Webhook sent successfully for requestId: ${requestId}`))
            .catch((err) => console.error(`❌ Failed to send webhook for requestId: ${requestId}`, err));
        }
      }
    });
  });
};

export default queue;
