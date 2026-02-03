// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },

//   logger: true,      // 🔥 ADD THIS
//   debug: true,       // 🔥 ADD THIS

//   tls: {
//     rejectUnauthorized: false
//   },

//   connectionTimeout: 30000,
//   greetingTimeout: 30000,
//   socketTimeout: 30000
// });

// async function sendQuotationEmail({ to, subject, text, attachmentPath }) {

//   console.log("📧 SMTP USER →", process.env.EMAIL_USER);
//   console.log("📎 ATTACHMENT EXISTS →", require("fs").existsSync(attachmentPath));

//   // TEST CONNECTION FIRST
//   await transporter.verify();

//   return transporter.sendMail({
//     from: `"ERP System" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     attachments: [
//       {
//         filename: "Quotation.pdf",
//         path: attachmentPath,
//       },
//     ],
//   });
// }

// module.exports = { sendQuotationEmail,transporter};

const axios = require("axios");
const fs = require("fs");

async function sendQuotationEmail({ to, subject, text, attachmentPath }) {

  console.log("📧 BREVO API → sending to:", to);
  console.log("📎 Attachment exists:", fs.existsSync(attachmentPath));

  const fileContent = fs.readFileSync(attachmentPath, { encoding: "base64" });

  const payload = {
    sender: {
      name: "ERP System",
      email: "pranavmahale08@gmail.com"
    },

    to: [
      {
        email: to
      }
    ],

    subject: subject,

    textContent: text,

    attachment: [
      {
        name: "Quotation.pdf",
        content: fileContent
      }
    ]
  };

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ BREVO API RESPONSE:", response.data);

    return {
      success: true,
      id: response.data.messageId
    };

  } catch (err) {
    console.log("❌ BREVO API ERROR:", err.response?.data || err.message);
    throw new Error("Brevo API Failed");
  }
}

module.exports = { sendQuotationEmail };
