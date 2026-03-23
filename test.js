/**
 * test.js — quick contract smoke tests (no test framework needed)
 * Run: node test.js  (while server is running on port 3000)
 */

const BASE = "http://localhost:3000";

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return res.json();
}

function assert(label, condition, actual) {
  if (condition) {
    console.log(`  ✅ ${label}`);
  } else {
    console.error(`  ❌ ${label}`, actual !== undefined ? `— got: ${JSON.stringify(actual)}` : "");
  }
}

async function run() {
  console.log("\n🧪 Smart Intent Wallet — API Contract Tests\n");

  // Test 1: Health check
  console.log("1. GET /");
  const health = await get("/");
  assert("success is true", health.success === true);
  assert("has data.status", !!health.data?.status);

  // Test 2: POST /api/intent — transfer
  console.log("\n2. POST /api/intent — transfer");
  const t1 = await post("/api/intent", { userInput: "Send 0.01 SHM to 0xAbC123" });
  assert("success is true", t1.success === true, t1);
  assert("has data.action", !!t1.data?.action, t1.data);
  assert("action is transfer", t1.data?.action === "transfer", t1.data?.action);
  assert("amount is '0.01'", t1.data?.amount === "0.01", t1.data?.amount);
  assert("token is 'SHM'", t1.data?.token === "SHM", t1.data?.token);
  assert("has to field", !!t1.data?.to, t1.data?.to);
  assert("has summary", typeof t1.data?.summary === "string", t1.data?.summary);
  assert("txStatus is completed", t1.data?.txStatus === "completed", t1.data?.txStatus);
  assert("error is null", t1.error === null);

  // Test 3: POST /api/intent — balance check
  console.log("\n3. POST /api/intent — balance check");
  const t2 = await post("/api/intent", { userInput: "Check my SHM balance" });
  assert("success is true", t2.success === true);
  assert("action is check_balance", t2.data?.action === "check_balance", t2.data?.action);

  // Test 4: POST /api/intent — missing input
  console.log("\n4. POST /api/intent — missing userInput");
  const t3 = await post("/api/intent", {});
  assert("success is false", t3.success === false);
  assert("error is not null", t3.error !== null, t3.error);

  // Test 5: GET /api/history
  console.log("\n5. GET /api/history");
  const hist = await get("/api/history");
  assert("success is true", hist.success === true);
  assert("data is array", Array.isArray(hist.data));
  assert("error is null", hist.error === null);
  if (hist.data.length > 0) {
    const entry = hist.data[0];
    assert("history entry has action", !!entry.action);
    assert("history entry has status", !!entry.status);
    assert("history entry has timestamp", !!entry.timestamp);
  }

  console.log("\n✨ Done.\n");
}

run().catch(console.error);