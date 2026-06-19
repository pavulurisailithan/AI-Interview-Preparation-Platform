import { useState, useEffect } from 'react'
import { uploadResume, getMyResumes } from '../services/authService'
import { toast } from 'react-toastify'

const Resume = () => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resumes, setResumes] = useState([])
  const [selected, setSelected] = useState(null)
  const [drag, setDrag] = useState(false)

  useEffect(() => {
    getMyResumes()
      .then(r => { setResumes(r.data); if (r.data.length) setSelected(r.data[0]) })
      .catch(() => {})
  }, [])

  const handleUpload = async e => {
    e.preventDefault()
    if (!file) { toast.error('Please select a PDF file'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await uploadResume(fd)
      toast.success('Resume analyzed! ✅')
      const newList = [data, ...resumes]
      setResumes(newList)
      setSelected(data)
      setFile(null)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed. Make sure it is a valid PDF.')
    }
    setLoading(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') setFile(f)
    else toast.error('Only PDF files are supported')
  }

  const scoreColor = sc => sc >= 70 ? '#66bb6a' : sc >= 40 ? '#ffa726' : '#e53935'
  const scoreLabel = sc => sc >= 70 ? 'Excellent' : sc >= 40 ? 'Average' : 'Needs Work'
  const circumference = 2 * Math.PI * 42

  return (
    <div style={s.page}>
      <h2 style={s.heading}>📄 Resume Analysis</h2>
      <div style={s.layout}>

        {/* LEFT PANEL */}
        <div style={s.left}>
          <div style={s.card}>
            <h3 style={s.cardTitle}>📤 Upload Resume (PDF)</h3>
            <form onSubmit={handleUpload}>
              <div
                style={{ ...s.dropZone, borderColor: drag ? '#4fc3f7' : '#ddd', background: drag ? '#e3f2fd' : '#fafafa' }}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
              >
                <div style={{ fontSize: 40, marginBottom: 8 }}>📎</div>
                <p style={{ color: '#888', fontSize: 14, margin: '0 0 12px' }}>Drag & drop PDF here, or</p>
                <label style={s.fileBtn}>
                  Browse File
                  <input type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files[0]; if (f) setFile(f) }} />
                </label>
                {file && (
                  <div style={{ marginTop: 10, fontSize: 13, color: '#4fc3f7', fontWeight: 600 }}>
                    ✅ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
              <button
                style={{ ...s.btn, opacity: (!file || loading) ? 0.6 : 1, marginTop: 12 }}
                type="submit" disabled={!file || loading}
              >
                {loading ? '🔍 Analyzing...' : '🔍 Analyze Resume'}
              </button>
            </form>
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>📁 My Resumes ({resumes.length})</h3>
            {!resumes.length && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#aaa' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                <p style={{ fontSize: 14 }}>No resumes uploaded yet</p>
              </div>
            )}
            {resumes.map(r => (
              <div key={r.id} onClick={() => setSelected(r)}
                style={{ ...s.resumeItem, background: selected?.id === r.id ? '#e3f2fd' : '#f8f9fa', borderColor: selected?.id === r.id ? '#4fc3f7' : '#e0e0e0' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>📄 {r.fileName}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 12, color: '#aaa' }}>{r.uploadedAt?.split('T')[0]}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(r.atsScore) }}>ATS: {r.atsScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={s.right}>
          {!selected ? (
            <div style={{ ...s.card, textAlign: 'center', color: '#aaa', padding: '80px 24px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
              <p style={{ fontSize: 16 }}>Upload a resume or select one from the list to see analysis</p>
            </div>
          ) : (
            <div style={s.card}>
              <h3 style={{ ...s.cardTitle, marginBottom: 20 }}>🔍 Analysis: {selected.fileName}</h3>

              {/* Score Circle */}
              <div style={s.scoreSection}>
                <div style={{ flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ width: 150, height: 150 }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#eee" strokeWidth="10" />
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke={scoreColor(selected.atsScore)} strokeWidth="10"
                      strokeDasharray={`${(selected.atsScore / 100) * circumference} ${circumference}`}
                      strokeLinecap="round" transform="rotate(-90 50 50)" />
                    <text x="50" y="45" textAnchor="middle" fontSize="20" fontWeight="800" fill={scoreColor(selected.atsScore)}>{selected.atsScore}%</text>
                    <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#888">ATS SCORE</text>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: scoreColor(selected.atsScore), marginBottom: 6 }}>
                    {scoreLabel(selected.atsScore)} Resume
                  </div>
                  <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                    {selected.atsScore >= 70
                      ? '✅ Your resume is well-optimized for ATS systems. Recruiters can easily parse it.'
                      : selected.atsScore >= 40
                        ? '⚠️ Some improvements needed for better ATS compatibility.'
                        : '❌ Significant improvements needed to pass ATS screening filters.'}
                  </p>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {[
                      { label: 'ATS Score', value: `${selected.atsScore}%`, color: scoreColor(selected.atsScore) },
                      { label: 'Uploaded', value: selected.uploadedAt?.split('T')[0] || '—', color: '#4fc3f7' },
                    ].map((item, i) => (
                      <div key={i} style={{ background: '#f0f4f8', padding: '8px 14px', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: '#aaa' }}>{item.label}</div>
                        <div style={{ fontWeight: 700, color: item.color, fontSize: 15 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <h4 style={s.secTitle}>🔧 Detected Skills</h4>
              <div style={s.skillsWrap}>
                {selected.skills?.split(', ').filter(Boolean).length > 0
                  ? selected.skills.split(', ').filter(Boolean).map((sk, i) => (
                    <span key={i} style={s.skill}>{sk}</span>
                  ))
                  : <span style={{ color: '#aaa', fontSize: 14 }}>No skills detected. Add more technical keywords to your resume.</span>
                }
              </div>

              {/* Suggestions */}
              <h4 style={s.secTitle}>💡 Improvement Suggestions</h4>
              <div>
                {selected.suggestions?.split(' | ').filter(Boolean).map((sg, i) => (
                  <div key={i} style={s.suggestion}>
                    <span style={{ color: '#ffa726', marginRight: 8, fontSize: 16 }}>▶</span>
                    {sg}
                  </div>
                ))}
              </div>
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
  left: { flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: 16 },
  right: { flex: 1, minWidth: 280 },
  card: { background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitle: { margin: '0 0 16px', color: '#1a1a2e', fontSize: 16, fontWeight: 700 },
  dropZone: { border: '2px dashed', borderRadius: 10, padding: '28px 16px', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' },
  fileBtn: { background: '#1a1a2e', color: '#fff', padding: '9px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'inline-block' },
  btn: { width: '100%', padding: 12, background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 600 },
  resumeItem: { padding: '12px 14px', borderRadius: 8, marginBottom: 8, cursor: 'pointer', border: '1.5px solid', transition: 'all 0.2s' },
  scoreSection: { display: 'flex', gap: 20, alignItems: 'center', background: '#f8f9fa', borderRadius: 12, padding: 20, marginBottom: 24, flexWrap: 'wrap' },
  secTitle: { color: '#1a1a2e', margin: '20px 0 10px', fontSize: 14, fontWeight: 700 },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  skill: { background: '#e3f2fd', color: '#1565c0', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700 },
  suggestion: { padding: '10px 14px', fontSize: 14, color: '#444', background: '#fffde7', borderRadius: 8, marginBottom: 8, display: 'flex', alignItems: 'flex-start' }
}

export default Resume
