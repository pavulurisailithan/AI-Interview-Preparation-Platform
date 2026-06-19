import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register } from '../services/authService'
import { toast } from 'react-toastify'

const Register = () => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const { saveUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await register(form)
      saveUser({ fullName: data.fullName, email: data.email, role: data.role, userId: data.userId }, data.token)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  const f = (k, v) => setForm({ ...form, [k]: v })

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🧠</div>
        <h2 style={s.title}>Create Account</h2>
        <p style={s.sub}>Start your interview prep journey</p>
        <form onSubmit={handleSubmit}>
          <input style={s.input} placeholder="Full Name" value={form.fullName} onChange={e => f('fullName', e.target.value)} required />
          <input style={s.input} type="text" placeholder="Email Address" value={form.email} onChange={e => f('email', e.target.value)} required />
          <input style={s.input} placeholder="Phone (optional)" value={form.phone} onChange={e => f('phone', e.target.value)} />
          <input style={s.input} type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => f('password', e.target.value)} minLength={6} required />
          <button style={s.btn} type="submit" disabled={loading}>{loading ? '⏳ Creating...' : 'Create Account'}</button>
        </form>
        <p style={s.links}>Already have an account? <Link to="/login" style={s.link}>Sign In</Link></p>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' },
  card: { background: '#fff', padding: '40px 36px', borderRadius: 16, width: '100%', maxWidth: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' },
  logo: { textAlign: 'center', fontSize: 48, marginBottom: 4 },
  title: { textAlign: 'center', color: '#1a1a2e', margin: '0 0 4px', fontSize: 24 },
  sub: { textAlign: 'center', color: '#888', marginBottom: 28, fontSize: 14 },
  input: { width: '100%', padding: '12px 14px', marginBottom: 14, border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 13, background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 600 },
  links: { textAlign: 'center', marginTop: 18, fontSize: 14, color: '#666' },
  link: { color: '#4fc3f7', textDecoration: 'none', fontWeight: 500 }
}

export default Register
