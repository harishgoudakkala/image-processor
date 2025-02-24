import axios from "axios";
import sharp from "sharp";
import FormData from "form-data";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const processImage = async (url) => {
  try {
    const response = await axios({
      url,
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "Mozilla/5.0", 
      },
    });

    const metadata = await sharp(response.data).metadata();
    if (!metadata.format) {
      throw new Error("Unsupported image format or corrupted image.");
    }

    console.log(`Processing image: ${url} (${metadata.format})`);

    const buffer = await sharp(response.data).jpeg({ quality: 50 }).toBuffer();

    const tempFilePath = `./temp-${uuidv4()}.jpg`;
    fs.writeFileSync(tempFilePath, buffer);

    const form = new FormData();
    form.append("image", fs.createReadStream(tempFilePath));

    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    fs.unlinkSync(tempFilePath);

    return imgbbResponse.data.data.url;
  } catch (error) {
    console.error("Error processing image:", error);
    return null; 
  }
};
