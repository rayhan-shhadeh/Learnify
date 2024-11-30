import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function downloadPDF(url, savePath, filename) {
  try {
    const fullPath= savePath+filename;
    const directory = path.dirname(savePath);
    // Ensure the directory
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      console.log(`Directory created at: ${directory}`);
    }
    // Ensure the file exists or create it
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, ''); // Create an empty file
      console.log(`File created at: ${fullPath}`);
    }
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });
    const writer = fs.createWriteStream(fullPath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    console.log(`PDF successfully downloaded to: ${fullPath}`);
  } catch (error) {
    console.error("An error occurred while downloading the PDF:", error.message);
  }
}

export async function deletePDF(fullPath) {
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath); // Delete the file
      console.log(`PDF successfully deleted: ${fullPath}`);
    } else {
      console.log(`File does not exist: ${fullPath}`);
    }
  } catch (error) {
    console.error("An error occurred while deleting the PDF:", error.message);
  }
}

