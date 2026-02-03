require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const quotationRoutes = require("./routes/quotationRoutes");
const { transporter } = require("./services/emailService");
const axios = require("axios");

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

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "ERP System",
          email: "pranavmahale08@gmail.com"
        },
        to: [{ email: process.env.EMAIL_USER }],
        subject: "Brevo API Test",
        textContent: "Your email service is working via BREVO API"
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      status: "BREVO CONNECTED",
      response: response.data
    });

  } catch (err) {
    res.status(500).json({
      error: err.response?.data || err.message
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
