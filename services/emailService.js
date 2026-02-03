const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,               // 🔥 MUST be false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,   // 🔐 App Password, NOT Gmail password
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 20000,    // avoid Render timeout
  greetingTimeout: 20000,
  socketTimeout: 20000
});

async function sendQuotationEmail({ to, subject, text, attachmentPath }) {

  // 🔍 Verify connection before sending (helpful on Render)
  await transporter.verify();

  return transporter.sendMail({
    from: `"ERP System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "Quotation.pdf",
        path: attachmentPath,
      },
    ],
  });
}

module.exports = { sendQuotationEmail };
