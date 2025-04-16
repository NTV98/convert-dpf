import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

// Thay đường dẫn file và thư mục đầu ra ở đây
const inputFilePath = `D:\\TestLibre\\QLDT_TaiLieu_PTYC_V1.0 (5).docx`;
const outputDir = `D:\\TestLibre`;

async function convertDocxToPdf(input: string, outputDir: string) {
  const sofficeCmd = `soffice --headless --convert-to pdf "${input}" --outdir "${outputDir}"`;

  try {
    console.log("👉 Running LibreOffice command:");
    console.log(sofficeCmd);
    const { stdout, stderr } = await execAsync(sofficeCmd);

    console.log("✅ stdout:", stdout);
    if (stderr) console.error("⚠️ stderr:", stderr);
    console.log("🎉 Conversion complete!");
  } catch (error: any) {
    console.error("❌ Error during conversion:", error.message);
  }
}

convertDocxToPdf(inputFilePath, outputDir);
