import React from 'react'

const ACTION_ICONS = {
  send: '↗',
  transfer: '↗',
  swap: '⇄',
  check: '◎',
  balance: '◎',
  default: '◈',
}

const STATUS_CONFIG = {
  success: { color: 'var(--accent3)', label: 'SUCCESS', icon: '✓' },
  pending: { color: 'var(--warn)', label: 'PENDING', icon: '◌' },
  failed:  { color: 'var(--danger)', label: 'FAILED',  icon: '✕' },
  confirmed: { color: 'var(--accent3)', label: 'CONFIRMED', icon: '✓' },
}

function Field({ label, value, mono = true, highlight = false }) {
  if (!value && value !== 0) return null
  return (
    <div style={styles.field}>
      <span style={styles.fieldLabel}>{label}</span>
      <span style={{
        ...styles.fieldValue,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-ui)',
        color: highlight ? 'var(--accent)' : 'var(--text)',
      }}>
        {value}
      </span>
    </div>
  )
}

export default function IntentResult({ result, error }) {
  if (error) {
    return (
      <div style={{ ...styles.card, borderColor: '#ef444430' }}>
        <div style={styles.errorHeader}>
          <span style={styles.errorIcon}>✕</span>
          <span style={styles.errorTitle}>EXECUTION FAILED</span>
        </div>
        <p style={styles.errorMsg}>{error}</p>
      </div>
    )
  }

  if (!result) return null

  const { action, amount, token, to, summary, txStatus } = result
  const actionKey = (action || '').toLowerCase()
  const icon = ACTION_ICONS[actionKey] || ACTION_ICONS.default
  const statusCfg = STATUS_CONFIG[txStatus?.toLowerCase()]|| STATUS_CONFIG.pending

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.actionBadge}>
          <span style={styles.actionIcon}>{icon}</span>
          <span style={styles.actionLabel}>{(action || 'ACTION').toUpperCase()}</span>
        </div>
        <div style={{ ...styles.statusBadge, background: statusCfg.color + '18', border: `1px solid ${statusCfg.color}44`, color: statusCfg.color }}>
          <span>{statusCfg.icon}</span>
          <span>{statusCfg.label}</span>
        </div>
      </div>

      {summary && (
        <p style={styles.summary}>{summary}</p>
      )}

      <div style={styles.divider} />

      <div style={styles.fields}>
        <Field label="ACTION"    value={action}    highlight />
        <Field label="AMOUNT"    value={amount !== undefined ? `${amount} ${token || ''}`.trim() : undefined} highlight />
        <Field label="TOKEN"     value={token} />
        <Field label="RECIPIENT" value={to} />
        <Field label="STATUS"    value={txStatus} mono={false} />
      </div>
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
    animation: 'fadeUp 0.3s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  actionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  actionIcon: {
    fontSize: '22px',
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
  },
  actionLabel: {
    fontFamily: 'var(--font-ui)',
    fontWeight: 800,
    fontSize: '18px',
    color: 'var(--text)',
    letterSpacing: '1px',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '2px',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  summary: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    borderLeft: '2px solid var(--accent)',
    paddingLeft: '12px',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
  },
  fields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '2px',
    color: 'var(--text-dim)',
    fontWeight: 700,
  },
  fieldValue: {
    fontSize: '13px',
    wordBreak: 'break-all',
  },
  errorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  errorIcon: {
    color: 'var(--danger)',
    fontSize: '16px',
    fontFamily: 'var(--font-mono)',
  },
  errorTitle: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '3px',
    color: 'var(--danger)',
    fontWeight: 700,
  },
  errorMsg: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
  },
}