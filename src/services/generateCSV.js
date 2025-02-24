import fs from "fs";
import path from "path";
import fastCsv from "fast-csv";

export const generateCSV = async (request) => {
    const outputPath = path.join("output", `${request.requestId}.csv`);
    const csvStream = fastCsv.format({ headers: true });
    const writableStream = fs.createWriteStream(outputPath);
  
    writableStream.on("finish", () => console.log(`CSV saved: ${outputPath}`));
  
    csvStream.pipe(writableStream);
  
    request.products.forEach((product) => {
      csvStream.write({
        "Serial Number": product.serialNumber,
        "Product Name": product.productName,
        "Input Image Urls": product.inputImages.join(", "),
        "Output Image Urls": product.outputImages.join(", "),
      });
    });
  
    csvStream.end();
    return outputPath;
  };
  