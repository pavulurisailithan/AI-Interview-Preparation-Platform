import { useEffect, useState } from 'react'
import { adminGetStats, adminGetUsers, adminToggleUser, adminDeleteUser, adminGetQuestions, adminAddQuestion, adminUpdateQuestion, adminDeleteQuestion } from '../../services/authService'
import { toast } from 'react-toastify'

const CATS = ['TECHNICAL','HR','BEHAVIORAL']
const DIFFS = ['EASY','MEDIUM','HARD']
const blank = { questionText:'', expectedAnswer:'', category:'TECHNICAL', difficulty:'EASY', topic:'', keywords:'' }

const AdminDashboard = () => {
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [questions, setQuestions] = useState([])
  const [form, setForm] = useState(blank)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (tab==='stats') adminGetStats().then(r => setStats(r.data)).catch(() => {})
    if (tab==='users') adminGetUsers().then(r => setUsers(r.data)).catch(() => {})
    if (tab==='questions') adminGetQuestions().then(r => setQuestions(r.data)).catch(() => {})
  }, [tab])

  const toggleUser = async id => { await adminToggleUser(id); setUsers(users.map(u => u.id===id ? {...u,enabled:!u.enabled} : u)) }
  const deleteUser = async id => { if (!confirm('Delete user?')) return; await adminDeleteUser(id); setUsers(users.filter(u => u.id!==id)); toast.success('Deleted') }

  const saveQ = async e => {
    e.preventDefault()
    try {
      if (editId) { const {data} = await adminUpdateQuestion(editId, form); setQuestions(questions.map(q => q.id===editId?data:q)); toast.success('Updated') }
      else { const {data} = await adminAddQuestion(form); setQuestions([data,...questions]); toast.success('Added') }
      setForm(blank); setEditId(null); setShowForm(false)
    } catch { toast.error('Save failed') }
  }

  const editQ = q => { setForm({questionText:q.questionText, expectedAnswer:q.expectedAnswer||'', category:q.category, difficulty:q.difficulty, topic:q.topic||'', keywords:q.keywords||''}); setEditId(q.id); setShowForm(true) }
  const deleteQ = async id => { if (!confirm('Delete?')) return; await adminDeleteQuestion(id); setQuestions(questions.filter(q => q.id!==id)); toast.success('Deleted') }

  return (
    <div style={s.page}>
      <h2 style={s.heading}>🛡 Admin Dashboard</h2>
      <div style={s.tabs}>
        {[['stats','📊 Stats'],['users','👥 Users'],['questions','❓ Questions']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{...s.tabBtn, background: tab===k?'#1a1a2e':'#f0f0f0', color: tab===k?'#fff':'#333'}}>{l}</button>
        ))}
      </div>

      {tab==='stats' && stats && (
        <div style={s.statsRow}>
          {[['👥 Users',stats.totalUsers,'#4fc3f7'],['❓ Questions',stats.totalQuestions,'#66bb6a'],['📝 Interviews',stats.totalInterviews,'#ffa726'],['✅ Completed',stats.completedInterviews,'#ab47bc']].map(([l,v,c],i) => (
            <div key={i} style={{...s.statCard, borderTop:`4px solid ${c}`}}>
              <div style={{fontSize:28}}>{l.split(' ')[0]}</div>
              <div style={{fontSize:32,fontWeight:800,color:c}}>{v}</div>
              <div style={{color:'#666',fontSize:13}}>{l.split(' ').slice(1).join(' ')}</div>
            </div>
          ))}
        </div>
      )}

      {tab==='users' && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead><tr style={s.thead}>{['Name','Email','Role','Status','Joined','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={s.tr}>
                  <td style={s.td}>{u.fullName}</td>
                  <td style={s.td}>{u.email}</td>
                  <td style={s.td}><span style={{...s.badge, background:u.role==='ADMIN'?'#ab47bc':'#4fc3f7'}}>{u.role}</span></td>
                  <td style={s.td}><span style={{...s.badge, background:u.enabled?'#66bb6a':'#e53935'}}>{u.enabled?'Active':'Disabled'}</span></td>
                  <td style={s.td}>{u.createdAt?.split('T')[0]}</td>
                  <td style={s.td}>
                    <button style={{...s.aBtn, background:u.enabled?'#ffa726':'#66bb6a'}} onClick={() => toggleUser(u.id)}>{u.enabled?'Disable':'Enable'}</button>
                    <button style={{...s.aBtn, background:'#e53935', marginLeft:6}} onClick={() => deleteUser(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='questions' && (
        <>
          <button style={{...s.addBtn, marginBottom:16}} onClick={() => { setForm(blank); setEditId(null); setShowForm(!showForm) }}>
            {showForm ? '✕ Cancel' : '+ Add Question'}
          </button>
          {showForm && (
            <form style={s.qForm} onSubmit={saveQ}>
              <textarea style={s.ta} placeholder="Question Text *" value={form.questionText} onChange={e => setForm({...form,questionText:e.target.value})} rows={3} required />
              <textarea style={s.ta} placeholder="Expected Answer" value={form.expectedAnswer} onChange={e => setForm({...form,expectedAnswer:e.target.value})} rows={3} />
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                <select style={s.sel} value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
                <select style={s.sel} value={form.difficulty} onChange={e => setForm({...form,difficulty:e.target.value})}>{DIFFS.map(d=><option key={d}>{d}</option>)}</select>
              </div>
              <input style={s.inp} placeholder="Topic (e.g. Java Basics)" value={form.topic} onChange={e => setForm({...form,topic:e.target.value})} />
              <input style={s.inp} placeholder="Keywords comma-separated (e.g. oop,class,object)" value={form.keywords} onChange={e => setForm({...form,keywords:e.target.value})} />
              <button style={s.addBtn} type="submit">{editId?'✅ Update':'✅ Add'} Question</button>
            </form>
          )}
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead><tr style={s.thead}>{['#','Question','Category','Difficulty','Topic','Actions'].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {questions.map((q,i) => (
                  <tr key={q.id} style={s.tr}>
                    <td style={s.td}>{i+1}</td>
                    <td style={{...s.td,maxWidth:320}}>{q.questionText}</td>
                    <td style={s.td}><span style={{...s.badge, background:'#4fc3f7'}}>{q.category}</span></td>
                    <td style={s.td}><span style={{...s.badge, background:q.difficulty==='EASY'?'#66bb6a':q.difficulty==='MEDIUM'?'#ffa726':'#e53935'}}>{q.difficulty}</span></td>
                    <td style={s.td}>{q.topic}</td>
                    <td style={s.td}>
                      <button style={{...s.aBtn,background:'#1a1a2e'}} onClick={()=>editQ(q)}>Edit</button>
                      <button style={{...s.aBtn,background:'#e53935',marginLeft:6}} onClick={()=>deleteQ(q.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

const s = {
  page: { padding:24, maxWidth:1200, margin:'0 auto' },
  heading: { color:'#1a1a2e', marginBottom:16, fontSize:24 },
  tabs: { display:'flex', gap:8, marginBottom:20 },
  tabBtn: { padding:'10px 20px', border:'none', borderRadius:8, cursor:'pointer', fontWeight:700, fontSize:14, transition:'all 0.2s' },
  statsRow: { display:'flex', gap:16, flexWrap:'wrap' },
  statCard: { flex:1, minWidth:160, background:'#fff', padding:'24px', borderRadius:12, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', textAlign:'center' },
  tableWrap: { background:'#fff', borderRadius:12, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', overflow:'auto' },
  table: { width:'100%', borderCollapse:'collapse' },
  thead: { background:'#1a1a2e' },
  th: { padding:'12px 16px', textAlign:'left', fontSize:12, color:'#fff', fontWeight:700, textTransform:'uppercase', letterSpacing:0.5, whiteSpace:'nowrap' },
  tr: { borderBottom:'1px solid #f5f5f5' },
  td: { padding:'11px 16px', fontSize:14, color:'#333' },
  badge: { padding:'3px 10px', borderRadius:20, color:'#fff', fontSize:11, fontWeight:700 },
  aBtn: { padding:'5px 12px', color:'#fff', border:'none', borderRadius:6, cursor:'pointer', fontSize:13, fontWeight:600 },
  addBtn: { padding:'10px 20px', background:'linear-gradient(135deg,#1a1a2e,#0f3460)', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight:600 },
  qForm: { background:'#fff', padding:20, borderRadius:12, marginBottom:16, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', gap:10 },
  ta: { width:'100%', padding:10, border:'1.5px solid #e0e0e0', borderRadius:8, fontSize:14, resize:'vertical', boxSizing:'border-box', fontFamily:'inherit' },
  inp: { width:'100%', padding:10, border:'1.5px solid #e0e0e0', borderRadius:8, fontSize:14, boxSizing:'border-box' },
  sel: { flex:1, padding:10, border:'1.5px solid #e0e0e0', borderRadius:8, fontSize:14, minWidth:120 }
}

export default AdminDashboard
