const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function generateQuotationPDF(htmlContent, quotationId) {
  const pdfDir = path.join(process.cwd(), "pdf");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  // ✅ Explicit Chrome path used by Render
  const chromePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    "/opt/render/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome";

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: chromePath,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
    ],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const filePath = path.join(pdfDir, `quotation_${quotationId}.pdf`);

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return filePath;
}

module.exports = { generateQuotationPDF };
