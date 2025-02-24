import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["pending", "processing", "completed", "failed"], default: "pending" },
  products: [
    {
      serialNumber: Number,
      productName: String,
      inputImages: [String],
      outputImages: [String],
    },
  ],
  webhookUrl: { type: String },
  csvFilePath: { type: String },
  createdAt: { type: Date, default: Date.now },

});

const Request = mongoose.model("Request", requestSchema);
export default Request;
