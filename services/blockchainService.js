/**
 * blockchainService.js
 * Simulates blockchain transactions for demo.
 * Swap out simulateTransaction() with real ethers.js calls for production.
 */

const SIMULATED_BALANCE = {
  SHM: "142.50",
  ETH: "0.85",
  USDT: "500.00"
};

/**
 * Simulate a transfer transaction
 * Returns a fake tx hash and status
 */
async function executeTransfer({ amount, token, to }) {
  // Validate inputs
  if (!amount || isNaN(parseFloat(amount))) {
    throw new Error("Invalid amount");
  }
  if (!to) {
    throw new Error("Recipient address/name is required for transfer");
  }

  // Simulate network delay (50–150ms)
  await delay(50 + Math.random() * 100);

  const txHash = generateTxHash();

  return {
    txHash,
    txStatus: "completed",
    network: "Shardeum",
    gasUsed: "21000",
    blockNumber: Math.floor(Math.random() * 1000000 + 500000).toString()
  };
}

/**
 * Simulate balance check
 */
async function checkBalance(token = "SHM") {
  await delay(30);
  const balance = SIMULATED_BALANCE[token.toUpperCase()] || "0.00";
  return { balance, token: token.toUpperCase(), network: "Shardeum" };
}

/**
 * Simulate a token swap
 */
async function executeSwap({ amount, token, to }) {
  await delay(80 + Math.random() * 100);
  const targetToken = to || "USDT";
  const txHash = generateTxHash();
  return {
    txHash,
    txStatus: "completed",
    fromToken: token,
    toToken: targetToken,
    network: "Shardeum"
  };
}

/**
 * Route to the right blockchain action based on parsed intent
 */
async function executeIntent(intent) {
  const { action, amount, token, to } = intent;

  switch (action) {
    case "transfer":
      return executeTransfer({ amount, token, to });

    case "check_balance":
      return checkBalance(token);

    case "swap":
      return executeSwap({ amount, token, to });

    default:
      // Unknown action — still return a stub so the API doesn't break
      return { txStatus: "no_action", note: "Action not recognized" };
  }
}

// --- Helpers ---

function generateTxHash() {
  const chars = "abcdef0123456789";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { executeIntent };