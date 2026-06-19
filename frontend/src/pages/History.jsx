import { useEffect, useState } from 'react'
import { getMyInterviews, getResults, getFeedback } from '../services/authService'

const History = () => {
  const [interviews, setInterviews] = useState([])
  const [selected, setSelected] = useState(null)
  const [results, setResults] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMyInterviews().then(r => setInterviews(r.data)).catch(() => {})
  }, [])

  const handleSelect = async iv => {
    setSelected(iv)
    setLoading(true)
    setResults([])
    setFeedback(null)
    try {
      const [rRes, fRes] = await Promise.all([
        getResults(iv.id).catch(() => ({ data: [] })),
        getFeedback(iv.id).catch(() => ({ data: null }))
      ])
      setResults(rRes.data || [])
      setFeedback(fRes.data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  const sc = v => v == null ? '#aaa' : v >= 70 ? '#66bb6a' : v >= 40 ? '#ffa726' : '#e53935'

  return (
    <div style={s.page}>
      <h2 style={s.heading}>📋 Interview History</h2>
      <div style={s.layout}>

        {/* LEFT LIST */}
        <div style={s.left}>
          {!interviews.length && (
            <div style={{ textAlign: 'center', padding: 32, color: '#aaa' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
              <p>No interviews yet</p>
            </div>
          )}
          {interviews.map(iv => (
            <div key={iv.id} onClick={() => handleSelect(iv)}
              style={{ ...s.ivCard, borderLeft: `4px solid ${sc(iv.overallScore)}`, background: selected?.id === iv.id ? '#e3f2fd' : '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{iv.category}</span>
                <span style={{ fontWeight: 800, color: sc(iv.overallScore), fontSize: 16 }}>
                  {iv.overallScore != null ? iv.overallScore + '%' : '—'}
                </span>
              </div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
                {iv.difficulty} • {iv.status} • {iv.startedAt?.split('T')[0]}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT DETAIL */}
        <div style={s.right}>
          {!selected && (
            <div style={{ ...s.card, textAlign: 'center', color: '#aaa', padding: '80px 24px' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <p>Select an interview from the list to view full details</p>
            </div>
          )}
          {selected && loading && (
            <div style={{ ...s.card, textAlign: 'center', padding: 60, color: '#aaa' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
              <p>Loading details...</p>
            </div>
          )}
          {selected && !loading && (
            <div style={s.card}>
              <h3 style={{ margin: '0 0 16px', color: '#1a1a2e' }}>{selected.category} — {selected.difficulty}</h3>

              <div style={s.chips}>
                {[
                  ['Score', selected.overallScore != null ? selected.overallScore + '%' : '—'],
                  ['Questions', results.length],
                  ['Status', selected.status],
                  ['Date', selected.startedAt?.split('T')[0]]
                ].map(([l, v], i) => (
                  <div key={i} style={s.chip}>
                    <div style={{ fontSize: 11, color: '#aaa' }}>{l}</div>
                    <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15 }}>{v}</div>
                  </div>
                ))}
              </div>

              {feedback && (
                <div style={s.fbBox}>
                  <h4 style={{ margin: '0 0 10px', color: '#1a1a2e', fontSize: 15 }}>🤖 AI Feedback</h4>
                  {feedback.overallFeedback && <p style={s.fbText}>{feedback.overallFeedback}</p>}
                  {feedback.strongAreas && (
                    <p style={s.fbText}>
                      <strong style={{ color: '#66bb6a' }}>✅ Strong Areas:</strong> {feedback.strongAreas}
                    </p>
                  )}
                  {feedback.weakAreas && (
                    <p style={s.fbText}>
                      <strong style={{ color: '#e53935' }}>⚠️ Weak Areas:</strong> {feedback.weakAreas}
                    </p>
                  )}
                  {feedback.improvementSuggestions && (
                    <p style={s.fbText}>
                      <strong style={{ color: '#ffa726' }}>💡 Tips:</strong> {feedback.improvementSuggestions}
                    </p>
                  )}
                </div>
              )}

              {results.length > 0 && (
                <>
                  <h4 style={{ margin: '20px 0 12px', color: '#1a1a2e' }}>📝 Answer Details</h4>
                  {results.map((r, i) => (
                    <div key={i} style={s.resultItem}>
                      <div style={{ fontWeight: 600, marginBottom: 6, color: '#1a1a2e', lineHeight: 1.4 }}>
                        Q{i + 1}: {r.question?.questionText}
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 8, fontStyle: 'italic', background: '#f0f4f8', padding: '8px 10px', borderRadius: 6 }}>
                        "{r.userAnswer || '(No answer)'}"
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 12px', borderRadius: 20, color: '#fff', fontSize: 13, fontWeight: 700, background: r.score >= 70 ? '#66bb6a' : r.score >= 40 ? '#ffa726' : '#e53935' }}>
                          {r.score?.toFixed(1)}%
                        </span>
                        {r.matchedKeywords && (
                          <span style={{ fontSize: 12, color: '#1565c0' }}>Keywords: {r.matchedKeywords}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{r.feedback}</div>
                    </div>
                  ))}
                </>
              )}

              {selected.status === 'IN_PROGRESS' && (
                <div style={{ padding: '12px 16px', background: '#fff3e0', borderRadius: 8, marginTop: 12, fontSize: 14, color: '#e65100' }}>
                  ⚠️ This interview is still in progress. Complete it to see full results.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  heading: { color: '#1a1a2e', marginBottom: 20, fontSize: 24 },
  layout: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  left: { flex: '0 0 300px', display: 'flex', flexDirection: 'column', gap: 8 },
  right: { flex: 1, minWidth: 280 },
  ivCard: { background: '#fff', padding: '14px 16px', borderRadius: 10, cursor: 'pointer', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', transition: 'all 0.2s' },
  card: { background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  chips: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 },
  chip: { background: '#f8f9fa', padding: '8px 16px', borderRadius: 8, textAlign: 'center', minWidth: 80 },
  fbBox: { background: '#f8f9fa', padding: 16, borderRadius: 10, marginBottom: 12 },
  fbText: { margin: '6px 0', fontSize: 14, color: '#444', lineHeight: 1.5 },
  resultItem: { background: '#f8f9fa', padding: 14, borderRadius: 10, marginBottom: 10, borderLeft: '3px solid #4fc3f7' }
}

export default History
