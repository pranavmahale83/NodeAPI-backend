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
    await transporter.verify();
    res.json({ status: "SMTP CONNECTED" });
  } catch (err) {
    res.json({
      error: err.message,
      code: err.code,
      command: err.command
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
