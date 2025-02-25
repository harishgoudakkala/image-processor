import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";
import fs from "fs";
import path from "path";
// import { v4 as uuidv4 } from "uuid";

export const processImage = async (url) => {
  try {
    console.log(`🔹 Starting image processing for: ${url}`);
    const response = await axios({
      url,
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0", 
      },
    });
    console.log(`✅ Successfully downloaded image: ${url}`);

    const metadata = await sharp(response.data).metadata();
    if (!metadata.format) {
      throw new Error("Unsupported image format or corrupted image.");
    }
    console.log(`🛠️ Image format: ${metadata.format}, Size: ${metadata.width}x${metadata.height}`);

    // console.log(`Processing image: ${url} (${metadata.format})`);

    const buffer = await sharp(response.data).jpeg({ quality: 50 }).toBuffer();
    const tempDir = "/tmp";  
    const fileName = `temp-${Date.now()}.jpg`;
    const filePath = path.join(tempDir, fileName);
    console.log(`📂 Saving file to: ${filePath}`);

    fs.writeFileSync(filePath, buffer);

    const form = new FormData();
    form.append("image", fs.createReadStream(filePath));

    console.log(`📡 Uploading to ImgBB...`);


    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );
    console.log(`✅ ImgBB Upload Success: ${imgbbResponse.data.data.url}`);

    fs.unlinkSync(filePath);

    return imgbbResponse.data.data.url;
  } catch (error) {
    console.error("Error processing image:", error);
    return null; 
  }
};
