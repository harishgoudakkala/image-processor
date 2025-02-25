import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";
import fs from "fs";
import path from "path";

export const processImage = async (url) => {
  try {
    console.log(`🔹 Starting image processing for: ${url}`);

    // 1️⃣ Download Image
    const response = await axios({
      url,
      responseType: "arraybuffer",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    console.log(`✅ Successfully downloaded image: ${url}`);

    // 2️⃣ Get Image Metadata
    const metadata = await sharp(response.data).metadata();
    if (!metadata.format) {
      throw new Error("Unsupported image format or corrupted image.");
    }
    console.log(`🛠️ Image format: ${metadata.format}, Size: ${metadata.width}x${metadata.height}`);

    // 3️⃣ Process Image (Resize & Compress)
    const buffer = await sharp(response.data)
      .resize({ width: 800 }) // Resize width to 800px (preserve aspect ratio)
      .jpeg({ quality: 50 }) // Reduce quality to 50%
      .toBuffer();
    console.log(`✅ Image processed successfully, size: ${buffer.length} bytes`);

    // 4️⃣ Save Temp File (for upload)
    const tempDir = "/tmp"; // ✅ Only writable directory in Vercel
    const fileName = `temp-${Date.now()}.jpg`;
    const filePath = path.join(tempDir, fileName);
    fs.writeFileSync(filePath, buffer);
    console.log(`📂 File saved at: ${filePath}`);

    // 5️⃣ Prepare for Upload
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    // 6️⃣ Upload to ImgBB (Retry 3 times if it fails)
    let uploadUrl = null;
    for (let i = 0; i < 3; i++) {
      try {
        console.log(`📡 Attempt ${i + 1}: Uploading to ImgBB...`);
        const imgbbResponse = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
          form,
          { headers: form.getHeaders(), timeout: 60000 }
        );
        uploadUrl = imgbbResponse.data.data.url;
        console.log(`✅ ImgBB Upload Success: ${uploadUrl}`);
        break; // Stop retrying if successful
      } catch (uploadError) {
        console.error(`❌ ImgBB Upload Failed (Attempt ${i + 1}):`, uploadError.response?.data || uploadError);
        if (i === 2) throw uploadError; // Give up after 3 tries
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s before retry
      }
    }

    // 7️⃣ Clean up temp file
    fs.unlinkSync(filePath);
    console.log(`🗑️ Deleted temp file: ${filePath}`);

    return uploadUrl;
  } catch (error) {
    console.error("🚨 Error processing image:", error);
    return null;
  }
};
