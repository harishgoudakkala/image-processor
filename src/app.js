import express from 'express';
import {config} from 'dotenv';
import uploadRoutes from "./routes/upload.js";
import statusRoutes from "./routes/status.js";
import downloadRoutes from "./routes/download.js";
import webhookRoutes from "./routes/webhook.js";
config();
const app = express();
app.use(express.json())

app.use("/upload", uploadRoutes);
app.use("/status", statusRoutes);
app.use("/download", downloadRoutes);
app.use("/webhook", webhookRoutes);

export default app;