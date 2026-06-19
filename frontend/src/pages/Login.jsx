import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/authService'
import { toast } from 'react-toastify'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { saveUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
    setLoading(true)
    try {
      const { data } = await login(form)
      saveUser({ fullName: data.fullName, email: data.email, role: data.role, userId: data.userId }, data.token)
      toast.success('Login successful!')
      setTimeout(() => navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard'), 100)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🧠</div>
        <h2 style={s.title}>AI Interview Prep</h2>
        <p style={s.sub}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <input style={s.input} type="text" placeholder="Email address" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
          <input style={s.input} type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>
        <div style={s.hint}>
          <p style={{ color: '#888', fontSize: 12, margin: '12px 0 4px' }}>Demo credentials:</p>
          <p style={{ color: '#555', fontSize: 12, margin: 0 }}>Admin: admin@interviewprep.com / Admin@123</p>
        </div>
        <p style={s.links}>
          <Link to="/forgot-password" style={s.link}>Forgot Password?</Link>
          {' · '}
          <Link to="/register" style={s.link}>Create Account</Link>
        </p>
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
  input: { width: '100%', padding: '12px 14px', marginBottom: 14, border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 15, boxSizing: 'border-box', outline: 'none', display: 'block' },
  btn: { width: '100%', padding: 13, background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 600, marginTop: 4 },
  hint: { background: '#f8f9fa', padding: '10px 14px', borderRadius: 8, marginTop: 16, textAlign: 'center' },
  links: { textAlign: 'center', marginTop: 18, fontSize: 14, color: '#666' },
  link: { color: '#4fc3f7', textDecoration: 'none', fontWeight: 500 }
}

export default Login
