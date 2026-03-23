const express = require("express");
const router = express.Router();
const { parseIntent } = require("../services/aiService");
const { executeIntent } = require("../services/blockchainService");

// In-memory transaction store
const transactions = [];

/**
 * POST /api/intent
 * Accepts natural language and returns structured transaction result
 */
router.post("/intent", async (req, res) => {
  const { userInput } = req.body;

  // Validate request
  if (!userInput || typeof userInput !== "string" || userInput.trim() === "") {
    return res.status(400).json({
      success: false,
      data: {},
      error: "userInput is required and must be a non-empty string"
    });
  }

  try {
    // Step 1: Parse intent via Gemini (or fallback)
    const intent = await parseIntent(userInput.trim());

    // Step 2: Execute on blockchain (simulated)
    const txResult = await executeIntent(intent);

    // Step 3: Build response data
    const responseData = {
      action: intent.action || "unknown",
      amount: intent.amount || null,
      token: intent.token || "SHM",
      to: intent.to || null,
      summary: intent.summary || userInput,
      txStatus: txResult.txStatus || "completed",
      ...(txResult.txHash && { txHash: txResult.txHash }),
      ...(txResult.balance && { balance: txResult.balance }),
      ...(txResult.network && { network: txResult.network })
    };

    // Step 4: Persist to in-memory history
    transactions.unshift({
      action: responseData.action,
      amount: responseData.amount,
      token: responseData.token,
      to: responseData.to,
      summary: responseData.summary,
      status: responseData.txStatus,
      ...(responseData.txHash && { txHash: responseData.txHash }),
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 transactions
    if (transactions.length > 50) transactions.splice(50);

    return res.json({
      success: true,
      data: responseData,
      error: null
    });

  } catch (err) {
    console.error("Intent processing error:", err.message);
    return res.status(500).json({
      success: false,
      data: {},
      error: err.message || "Failed to process intent"
    });
  }
});

/**
 * GET /api/history
 * Returns all past transactions (most recent first)
 */
router.get("/history", (req, res) => {
  return res.json({
    success: true,
    data: transactions,
    error: null
  });
});

module.exports = router;