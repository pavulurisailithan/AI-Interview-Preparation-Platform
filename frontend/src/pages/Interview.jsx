import { useState, useEffect, useRef } from 'react'
import { startInterview, getQuestions, submitAnswer, completeInterview } from '../services/authService'
import { toast } from 'react-toastify'

const CATS = ['TECHNICAL', 'HR', 'BEHAVIORAL']
const DIFFS = ['EASY', 'MEDIUM', 'HARD']

const Interview = () => {
  const [phase, setPhase] = useState('setup')
  const [config, setConfig] = useState({ category: 'TECHNICAL', difficulty: 'MEDIUM', questionCount: 5 })
  const [questions, setQuestions] = useState([])
  const [idx, setIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState([])
  const [final, setFinal] = useState(null)
  const [timeLeft, setTimeLeft] = useState(180)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const timerRef = useRef(null)
  const startRef = useRef(null)
  const interviewRef = useRef(null)
  const questionsRef = useRef([])
  const idxRef = useRef(0)
  const resultsRef = useRef([])
  const answerRef = useRef('')
  const submittingRef = useRef(false)

  const stopTimer = () => { clearInterval(timerRef.current); timerRef.current = null }

  const startTimer = () => {
    stopTimer()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          doSubmitRef.current(answerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const doSubmit = async (forcedAnswer) => {
    if (submittingRef.current) return
    stopTimer()
    const iv = interviewRef.current
    const qs = questionsRef.current
    const i = idxRef.current
    const res = resultsRef.current
    if (!iv || !qs.length) return
    submittingRef.current = true
    setSubmitting(true)
    const timeTaken = Math.round((Date.now() - startRef.current) / 1000)
    try {
      const ans = forcedAnswer !== undefined ? forcedAnswer : answerRef.current
      const { data: result } = await submitAnswer(iv.id, {
        questionId: qs[i].id,
        userAnswer: ans || '(No answer)',
        timeTakenSeconds: timeTaken
      })
      const newResults = [...res, result]
      resultsRef.current = newResults
      setResults(newResults)

      if (i + 1 < qs.length) {
        const nextIdx = i + 1
        idxRef.current = nextIdx
        answerRef.current = ''
        setIdx(nextIdx)
        setAnswer('')
        setTimeLeft(180)
        startRef.current = Date.now()
        startTimer()
      } else {
        const { data: done } = await completeInterview(iv.id)
        setFinal(done)
        setPhase('completed')
      }
    } catch {
      toast.error('Failed to submit answer. Please try again.')
      startTimer()
    }
    submittingRef.current = false
    setSubmitting(false)
  }

  // Keep a stable ref to doSubmit for the timer
  const doSubmitRef = useRef(doSubmit)
  useEffect(() => { doSubmitRef.current = doSubmit })

  useEffect(() => {
    answerRef.current = answer
  }, [answer])

  useEffect(() => {
    return () => stopTimer()
  }, [])

  const handleStart = async () => {
    setLoading(true)
    try {
      const { data: iv } = await startInterview(config)
      const { data: qs } = await getQuestions(iv.id)
      if (!qs || !qs.length) {
        toast.error('No questions found for this selection. Try a different category or difficulty.')
        setLoading(false)
        return
      }
      const sliced = qs.slice(0, config.questionCount)
      interviewRef.current = iv
      questionsRef.current = sliced
      idxRef.current = 0
      resultsRef.current = []
      answerRef.current = ''
      submittingRef.current = false
      setQuestions(sliced)
      setIdx(0)
      setResults([])
      setAnswer('')
      setTimeLeft(180)
      setPhase('active')
      startRef.current = Date.now()
      startTimer()
    } catch {
      toast.error('Failed to start interview. Check backend is running.')
    }
    setLoading(false)
  }

  const handleSubmitClick = () => { doSubmit(answer) }

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const scoreColor = sc => sc >= 70 ? '#66bb6a' : sc >= 40 ? '#ffa726' : '#e53935'
  const pct = Math.round(((idx + 1) / (questions.length || 1)) * 100)

  if (phase === 'setup') return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🎯 Mock Interview</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 28, fontSize: 14 }}>
          Configure your session and start practicing
        </p>

        <label style={s.label}>Interview Category</label>
        <div style={s.optRow}>
          {CATS.map(c => (
            <button key={c} type="button" onClick={() => setConfig({ ...config, category: c })}
              style={{ ...s.optBtn, background: config.category === c ? '#1a1a2e' : '#f5f5f5', color: config.category === c ? '#fff' : '#333' }}>
              {c === 'TECHNICAL' ? '💻' : c === 'HR' ? '🤝' : '🎭'} {c}
            </button>
          ))}
        </div>

        <label style={s.label}>Difficulty Level</label>
        <div style={s.optRow}>
          {DIFFS.map(d => (
            <button key={d} type="button" onClick={() => setConfig({ ...config, difficulty: d })}
              style={{ ...s.optBtn, background: config.difficulty === d ? (d === 'EASY' ? '#66bb6a' : d === 'MEDIUM' ? '#ffa726' : '#e53935') : '#f5f5f5', color: config.difficulty === d ? '#fff' : '#333' }}>
              {d === 'EASY' ? '🟢' : d === 'MEDIUM' ? '🟡' : '🔴'} {d}
            </button>
          ))}
        </div>

        <label style={s.label}>Number of Questions</label>
        <div style={s.optRow}>
          {[3, 5, 7, 10].map(n => (
            <button key={n} type="button" onClick={() => setConfig({ ...config, questionCount: n })}
              style={{ ...s.optBtn, background: config.questionCount === n ? '#4fc3f7' : '#f5f5f5', color: config.questionCount === n ? '#fff' : '#333' }}>
              {n} Qs
            </button>
          ))}
        </div>

        <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handleStart} disabled={loading}>
          {loading ? '⏳ Loading questions...' : '▶ Start Interview'}
        </button>
      </div>
    </div>
  )

  if (phase === 'active') {
    const q = questions[idx]
    if (!q) return <div style={s.page}><div style={s.card}><p>Loading question...</p></div></div>
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={s.topBar}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={s.qBadge}>{q.category}</span>
              <span style={{ ...s.qBadge, background: '#f0f0f0', color: '#333' }}>{q.difficulty}</span>
              <span style={{ ...s.qBadge, background: '#e8f5e9', color: '#2e7d32' }}>{q.topic}</span>
            </div>
            <span style={{ ...s.timer, color: timeLeft < 30 ? '#e53935' : '#1a1a2e' }}>⏱ {fmt(timeLeft)}</span>
          </div>

          <div style={s.progress}>
            <div style={{ ...s.progressFill, width: `${pct}%` }} />
          </div>
          <p style={s.qNum}>Question {idx + 1} of {questions.length}</p>
          <p style={s.question}>{q.questionText}</p>

          <textarea style={s.textarea} rows={8}
            placeholder="Type your detailed answer here... Include relevant keywords, examples, and explanations."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            autoFocus
            disabled={submitting}
          />

          <button style={{ ...s.btn, opacity: submitting ? 0.7 : 1 }} onClick={handleSubmitClick} disabled={submitting}>
            {submitting ? '⏳ Submitting...' : idx + 1 === questions.length ? '✅ Finish Interview' : '➡ Next Question'}
          </button>
        </div>
      </div>
    )
  }

  // completed
  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={{ ...s.title, color: '#66bb6a' }}>🎉 Interview Complete!</h2>
        <div style={s.scoreBox}>
          <div style={{ fontSize: 60, fontWeight: 800, color: scoreColor(final?.overallScore ?? 0) }}>
            {final?.overallScore != null ? final.overallScore.toFixed(1) : '0'}%
          </div>
          <div style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Overall Score</div>
          <div style={{ marginTop: 12, fontSize: 15, color: '#444' }}>
            {(final?.overallScore ?? 0) >= 80 ? '🌟 Outstanding!' : (final?.overallScore ?? 0) >= 60 ? '👍 Good job!' : (final?.overallScore ?? 0) >= 40 ? '📚 Keep practicing' : '💪 More practice needed'}
          </div>
        </div>

        <h3 style={{ color: '#1a1a2e', marginBottom: 12, fontSize: 16 }}>📝 Answer Breakdown</h3>
        {results.map((r, i) => (
          <div key={i} style={s.resultItem}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: '#1a1a2e', fontSize: 14 }}>
              Q{i + 1}: {questions[i]?.questionText}
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 8, fontStyle: 'italic', background: '#f0f4f8', padding: '8px 10px', borderRadius: 6 }}>
              "{r.userAnswer || '(No answer)'}"
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ ...s.badge, background: scoreColor(r.score ?? 0) }}>{(r.score ?? 0).toFixed(1)}%</span>
              <span style={{ fontSize: 13, color: '#555', flex: 1 }}>{r.feedback}</span>
            </div>
            {r.matchedKeywords && (
              <div style={{ marginTop: 4, fontSize: 12, color: '#1565c0' }}>
                ✅ Keywords matched: {r.matchedKeywords}
              </div>
            )}
          </div>
        ))}

        <button style={{ ...s.btn, marginTop: 16 }} onClick={() => { setPhase('setup'); setResults([]); setFinal(null); setIdx(0); setAnswer(''); setQuestions([]) }}>
          🔄 Start New Interview
        </button>
      </div>
    </div>
  )
}

const s = {
  page: { padding: 24, maxWidth: 800, margin: '0 auto' },
  card: { background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#1a1a2e', marginBottom: 8, fontSize: 24 },
  label: { display: 'block', marginBottom: 8, fontWeight: 600, color: '#444', fontSize: 14, marginTop: 4 },
  optRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  optBtn: { padding: '9px 18px', border: '1.5px solid #e0e0e0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' },
  btn: { width: '100%', padding: 14, background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 600, marginTop: 12 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  qBadge: { padding: '4px 10px', background: '#1a1a2e', color: '#fff', borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' },
  timer: { fontSize: 22, fontWeight: 800 },
  progress: { height: 6, background: '#eee', borderRadius: 3, marginBottom: 8 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#4fc3f7,#1a88c9)', borderRadius: 3, transition: 'width 0.4s' },
  qNum: { fontSize: 12, color: '#aaa', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  question: { fontSize: 19, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.6, marginBottom: 16, padding: '16px', background: '#f8f9fa', borderRadius: 10, borderLeft: '4px solid #4fc3f7' },
  textarea: { width: '100%', padding: 14, border: '1.5px solid #e0e0e0', borderRadius: 10, fontSize: 15, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.5 },
  scoreBox: { textAlign: 'center', padding: '28px 0', background: '#f8f9fa', borderRadius: 12, margin: '16px 0 24px' },
  resultItem: { background: '#f8f9fa', padding: 16, borderRadius: 10, marginBottom: 12, borderLeft: '4px solid #4fc3f7' },
  badge: { padding: '4px 12px', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }
}

export default Interview
