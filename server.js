require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const quotationRoutes = require("./routes/quotationRoutes");
const { transporter } = require("./services/emailService");

const app = express();
const PORT = process.env.PORT || 5001;

/* ------------------ Middlewares ------------------ */
app.use(cors());
app.use(express.json());

/* ------------------ Routes ------------------ */
app.use("/api/quotations", quotationRoutes);


app.get("/check", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

app.get("/test-mail", async (req, res) => {
  try {

    const mailOptions = {
      from: "ERP System <pranavmahale08@gmail.com>",   // Allowed in Brevo
      to: process.env.EMAIL_USER,
      subject: "Brevo Test Email",
      text: "Your email service is working correctly via Brevo SMTP."
    };

    const response = await transporter.sendMail(mailOptions);

    res.json({
      status: "BREVO CONNECTED",
      response: {
        messageId: response.messageId,
        accepted: response.accepted,
        rejected: response.rejected
      }
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
      name: err.name
    });

  }
});





/* ------------------ Server Start ------------------ */

async function startServer() {
  try {
    // Verify DB connection before starting server
    await db.query("SELECT 1");
    console.log("✅ Database connection successful");

    app.listen(PORT, () => {
      console.log(`🚀 ERP Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
