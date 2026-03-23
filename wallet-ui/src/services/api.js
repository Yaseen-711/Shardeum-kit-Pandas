const BASE_URL = 'http://localhost:3000'

/**
 * POST /api/intent
 * Body: { command: string }
 * Response: { success: boolean, data: { action, amount, token, recipient, summary, status }, error: string|null }
 */
export async function postIntent(command) {
  const response = await fetch(`${BASE_URL}/api/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userInput: command }),
  })

  const json = await response.json()
  return json // { success, data, error }
}

/**
 * GET /api/history
 * Response: { success: boolean, data: [...transactions], error: string|null }
 */
export async function getHistory() {
  const response = await fetch(`${BASE_URL}/api/history`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const json = await response.json()
  return json // { success, data, error }
}const BASE_URL = 'http://localhost:3000'

/**
 * POST /api/intent
 * Body: { command: string }
 * Response: { success: boolean, data: { action, amount, token, recipient, summary, status }, error: string|null }
 */
export async function postIntent(command) {
  const response = await fetch(`${BASE_URL}/api/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  })

  const json = await response.json()
  return json // { success, data, error }
}

/**
 * GET /api/history
 * Response: { success: boolean, data: [...transactions], error: string|null }
 */
export async function getHistory() {
  const response = await fetch(`${BASE_URL}/api/history`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const json = await response.json()
  return json // { success, data, error }
}