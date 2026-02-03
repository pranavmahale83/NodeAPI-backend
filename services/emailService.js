const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  logger: true,      // 🔥 ADD THIS
  debug: true,       // 🔥 ADD THIS

  tls: {
    rejectUnauthorized: false
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

async function sendQuotationEmail({ to, subject, text, attachmentPath }) {

  console.log("📧 SMTP USER →", process.env.EMAIL_USER);
  console.log("📎 ATTACHMENT EXISTS →", require("fs").existsSync(attachmentPath));

  // TEST CONNECTION FIRST
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
