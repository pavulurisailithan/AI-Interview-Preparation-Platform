import { useEffect, useState } from 'react'
import { getDashboard, getMyInterviews } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [interviews, setInterviews] = useState([])

  useEffect(() => {
    getDashboard().then(r => setStats(r.data)).catch(() => {})
    getMyInterviews().then(r => setInterviews(r.data)).catch(() => {})
  }, [])

  const scoreData = stats?.recentScores?.map((s, i) => ({ name: s.date || `#${i + 1}`, score: s.score })) || []
  const catData = stats?.scoreByCategory ? Object.entries(stats.scoreByCategory).map(([k, v]) => ({ name: k, score: Math.round(v) })) : []

  const statCards = [
    { label: 'Total Interviews', value: stats?.totalInterviews ?? 0, color: '#4fc3f7', icon: '📊' },
    { label: 'Completed', value: stats?.completedInterviews ?? 0, color: '#66bb6a', icon: '✅' },
    { label: 'Avg Score', value: stats?.averageScore != null ? stats.averageScore.toFixed(1) + '%' : '—', color: '#ffa726', icon: '🏆' },
  ]

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>👋 Welcome back, {user?.fullName?.split(' ')[0]}!</h2>
          <p style={s.sub}>Track your interview progress and keep practicing</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={s.startBtn} onClick={() => navigate('/interview')}>🎯 Start Interview</button>
          <button style={{ ...s.startBtn, background: 'linear-gradient(135deg,#66bb6a,#388e3c)' }} onClick={() => navigate('/resume')}>📄 Analyze Resume</button>
        </div>
      </div>

      <div style={s.statsRow}>
        {statCards.map((st, i) => (
          <div key={i} style={{ ...s.statCard, borderTop: `4px solid ${st.color}` }}>
            <div style={{ fontSize: 28 }}>{st.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: st.color, marginTop: 4 }}>{st.value}</div>
            <div style={{ color: '#666', fontSize: 13, marginTop: 2 }}>{st.label}</div>
          </div>
        ))}
      </div>

      {(scoreData.length > 0 || catData.length > 0) && (
        <div style={s.charts}>
          {scoreData.length > 0 && (
            <div style={s.chartBox}>
              <h4 style={s.chartTitle}>📈 Score Trend</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4fc3f7" strokeWidth={2.5} dot={{ r: 5, fill: '#4fc3f7' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {catData.length > 0 && (
            <div style={s.chartBox}>
              <h4 style={s.chartTitle}>📊 Score by Category</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={catData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#66bb6a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div style={s.tableCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
          <h3 style={{ margin: 0, color: '#1a1a2e', fontSize: 16 }}>🕐 Recent Interviews</h3>
          {interviews.length > 0 && (
            <button style={s.linkBtn} onClick={() => navigate('/history')}>View All →</button>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={s.th}>Category</th>
                <th style={s.th}>Difficulty</th>
                <th style={s.th}>Score</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {interviews.slice(0, 8).map(iv => (
                <tr key={iv.id} style={s.tr}>
                  <td style={s.td}>{iv.category}</td>
                  <td style={s.td}>{iv.difficulty}</td>
                  <td style={s.td}>
                    <strong style={{ color: iv.overallScore >= 70 ? '#66bb6a' : iv.overallScore >= 40 ? '#ffa726' : '#e53935' }}>
                      {iv.overallScore != null ? iv.overallScore + '%' : '—'}
                    </strong>
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: iv.status === 'COMPLETED' ? '#66bb6a' : '#ffa726' }}>{iv.status}</span>
                  </td>
                  <td style={s.td}>{iv.startedAt?.split('T')[0]}</td>
                </tr>
              ))}
              {!interviews.length && (
                <tr>
                  <td colSpan={5} style={{ ...s.td, textAlign: 'center', color: '#aaa', padding: 40 }}>
                    No interviews yet — <span style={{ color: '#4fc3f7', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/interview')}>start practicing! 🚀</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 },
  title: { color: '#1a1a2e', margin: 0, fontSize: 26 },
  sub: { color: '#888', margin: '4px 0 0', fontSize: 14 },
  startBtn: { background: 'linear-gradient(135deg,#4fc3f7,#1a88c9)', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  statsRow: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 },
  statCard: { flex: 1, minWidth: 160, background: '#fff', padding: '20px 24px', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', textAlign: 'center' },
  charts: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 },
  chartBox: { flex: 1, minWidth: 280, background: '#fff', padding: '20px 16px', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
  chartTitle: { margin: '0 0 12px', color: '#1a1a2e', fontSize: 15 },
  tableCard: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' },
  linkBtn: { background: 'none', border: 'none', color: '#4fc3f7', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e' },
  th: { padding: '11px 16px', textAlign: 'left', fontSize: 12, color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  tr: { borderBottom: '1px solid #f5f5f5' },
  td: { padding: '12px 16px', fontSize: 14, color: '#333' },
  badge: { padding: '3px 10px', borderRadius: 20, color: '#fff', fontSize: 11, fontWeight: 600 }
}

export default Dashboard
