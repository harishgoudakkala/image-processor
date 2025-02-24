import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
    const { requestId, status, products, csvDownloadUrl } = req.body;

    if (!requestId || !status || !products || !csvDownloadUrl) {
        return res.status(400).json({ message: "Invalid webhook payload" });
    }

    console.log(`✅ Webhook received for Request ID: ${requestId}`);
    console.log(`📌 Status: ${status}`);
    console.log(`📂 CSV Download URL: ${csvDownloadUrl}`);

    return res.json({ message: "Webhook processed successfully", requestId });
});

export default router;
