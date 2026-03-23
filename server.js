require("dotenv").config();
const express = require("express");
const cors = require("cors");
const intentRoutes = require("./routes/intent");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, data: { status: "Smart Intent Wallet API running" }, error: null });
});

// Routes
app.use("/api", intentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, data: {}, error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, data: {}, error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Smart Intent Wallet backend running at http://localhost:${PORT}`);
  console.log(`   POST /api/intent  — parse natural language`);
  console.log(`   GET  /api/history — transaction history`);
});