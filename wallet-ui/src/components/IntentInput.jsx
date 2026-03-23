import React, { useState } from 'react'

const EXAMPLES = [
  'Send 0.01 SHM to John',
  'Transfer 5 SHM to 0xabc123',
  'Swap 10 SHM for USDC',
  'Check balance of my wallet',
]

export default function IntentInput({ onExecute, loading }) {
  const [command, setCommand] = useState('')
  const [exampleIndex, setExampleIndex] = useState(0)

  const handleSubmit = () => {
    const trimmed = command.trim()
    if (!trimmed || loading) return
    onExecute(trimmed)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const useExample = (ex) => {
    setCommand(ex)
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardLabel}>INTENT</span>
        <span style={styles.cursor}>▊</span>
      </div>

      <p style={styles.hint}>Type a command in plain English</p>

      <div style={styles.inputWrap}>
        <span style={styles.prompt}>$</span>
        <textarea
          style={styles.textarea}
          value={command}
          onChange={e => setCommand(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Send 0.01 SHM to John..."
          rows={2}
          disabled={loading}
          spellCheck={false}
        />
      </div>

      <div style={styles.examples}>
        {EXAMPLES.map((ex, i) => (
          <button key={i} style={styles.exampleBtn} onClick={() => useExample(ex)}>
            {ex}
          </button>
        ))}
      </div>

      <button
        style={{
          ...styles.execBtn,
          ...(loading ? styles.execBtnDisabled : {}),
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <span style={styles.loadingRow}>
            <span style={styles.spinner} />
            Processing intent...
          </span>
        ) : (
          <>Execute <span style={styles.arrow}>→</span></>
        )}
      </button>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '3px',
    color: 'var(--accent)',
    fontWeight: 700,
  },
  cursor: {
    color: 'var(--accent)',
    fontSize: '14px',
    animation: 'blink 1s step-end infinite',
  },
  hint: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '12px 14px',
    transition: 'border-color 0.2s',
  },
  prompt: {
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent)',
    fontSize: '16px',
    lineHeight: '1.5',
    userSelect: 'none',
    paddingTop: '2px',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    lineHeight: '1.6',
    resize: 'none',
    width: '100%',
  },
  examples: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  exampleBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '4px 12px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  execBtn: {
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '1px',
    color: 'var(--bg)',
    background: 'var(--accent)',
    border: 'none',
    borderRadius: '6px',
    padding: '13px 24px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 0 20px #00e5ff33',
  },
  execBtnDisabled: {
    background: 'var(--surface2)',
    color: 'var(--text-muted)',
    boxShadow: 'none',
    cursor: 'not-allowed',
  },
  arrow: {
    fontSize: '18px',
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid var(--text-dim)',
    borderTop: '2px solid var(--text-muted)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
}