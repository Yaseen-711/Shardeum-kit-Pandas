import React, { useEffect, useState } from 'react'
import { getHistory } from '../services/api.js'

const STATUS_COLORS = {
  success: 'var(--accent3)',
  confirmed: 'var(--accent3)',
  pending: 'var(--warn)',
  failed: 'var(--danger)',
}

function TxRow({ tx, index }) {
  const statusColor = SSTATUS_COLORS[(tx.txStatus || '').toLowerCase()] || 'var(--text-dim)'
  const action = (tx.action || 'unknown').toLowerCase()

  return (
    <div style={{ ...styles.row, animationDelay: `${index * 40}ms` }}>
      <div style={styles.rowLeft}>
        <span style={styles.rowIndex}>#{String(index + 1).padStart(2, '0')}</span>
        <div style={styles.rowInfo}>
          <span style={styles.rowAction}>{action.toUpperCase()}</span>
          {tx.summary && <span style={styles.rowSummary}>{tx.summary}</span>}
        </div>
      </div>
      <div style={styles.rowRight}>
        {tx.amount !== undefined && (
          <span style={styles.rowAmount}>
            {tx.amount} {tx.token || ''}
          </span>
        )}
        <span style={{ ...styles.rowStatus, color: statusColor }}>
          {(tx.txStatus || 'unknown').toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export default function History({ refreshTrigger }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getHistory()
      if (res.success) {
        setHistory(Array.isArray(res.data) ? res.data : [])
      } else {
        setError(res.error || 'Failed to load history')
      }
    } catch (e) {
      setError('Cannot reach backend at http://localhost:3000')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [refreshTrigger])

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.label}>TRANSACTION HISTORY</span>
        <button style={styles.refreshBtn} onClick={load} disabled={loading}>
          {loading ? '⟳' : '↺'} Refresh
        </button>
      </div>

      {loading && (
        <div style={styles.center}>
          <span style={styles.spinner} />
          <span style={styles.loadingText}>Fetching transactions...</span>
        </div>
      )}

      {error && !loading && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠</span>
          {error}
        </div>
      )}

      {!loading && !error && history.length === 0 && (
        <div style={styles.empty}>
          <span style={styles.emptyIcon}>◎</span>
          <p style={styles.emptyText}>No transactions yet</p>
          <p style={styles.emptyHint}>Execute your first intent above</p>
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div style={styles.list}>
          {history.map((tx, i) => (
            <TxRow key={tx.id || i} tx={tx} index={i} />
          ))}
        </div>
      )}
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
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    letterSpacing: '3px',
    color: 'var(--accent)',
    fontWeight: 700,
  },
  refreshBtn: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '4px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    background: 'var(--bg)',
    borderRadius: '6px',
    gap: '12px',
    animation: 'fadeUp 0.3s ease both',
    transition: 'background 0.15s',
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },
  rowIndex: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-dim)',
    flexShrink: 0,
  },
  rowInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  rowAction: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '1px',
  },
  rowSummary: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '280px',
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px',
    flexShrink: 0,
  },
  rowAmount: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    color: 'var(--accent)',
    fontWeight: 700,
  },
  rowStatus: {
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '2px',
    fontWeight: 700,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '24px',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid var(--text-dim)',
    borderTop: '2px solid var(--accent)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  loadingText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--danger)',
    background: '#ef444410',
    border: '1px solid #ef444430',
    borderRadius: '6px',
    padding: '12px 16px',
  },
  errorIcon: {
    fontSize: '16px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '32px',
  },
  emptyIcon: {
    fontSize: '28px',
    color: 'var(--text-dim)',
  },
  emptyText: {
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  emptyHint: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--text-dim)',
  },
}