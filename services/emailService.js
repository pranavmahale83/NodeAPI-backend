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

const nodemailer = require("nodemailer");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  }
});

async function sendQuotationEmail({ to, subject, text, attachmentPath }) {

  console.log("📧 BREVO → sending to:", to);
  console.log("📎 Attachment exists:", fs.existsSync(attachmentPath));

  const fileBuffer = fs.readFileSync(attachmentPath);

  const mailOptions = {
    from: "ERP System <pranavmahale08@gmail.com>",   // can be gmail in Brevo
    to,
    subject,
    text,
    attachments: [
      {
        filename: "Quotation.pdf",
        content: fileBuffer
      }
    ]
  };

  try {
    const response = await transporter.sendMail(mailOptions);

    console.log("✅ BREVO RESPONSE:", response.messageId);

    return {
      success: true,
      messageId: response.messageId
    };

  } catch (err) {
    console.log("❌ BREVO ERROR:", err.message);
    throw err;
  }
}

module.exports = { sendQuotationEmail,transporter };
