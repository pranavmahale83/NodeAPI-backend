const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

async function generateQuotationPDF(htmlContent, quotationId) {
  // Ensure pdf directory exists
  const pdfDir = path.join(process.cwd(), "pdf");
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: puppeteer.executablePath(), // ✅ REQUIRED ON RENDER
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

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

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
