import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { forgotPassword, resetPassword } from '../services/authService'
import { toast } from 'react-toastify'

export const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    try { await forgotPassword(email); setSent(true); toast.success('Check console for reset token (dev mode)') }
    catch { toast.error('Email not found') }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🔑 Forgot Password</h2>
        {sent
          ? <p style={{ textAlign: 'center', color: '#66bb6a', lineHeight: 1.6 }}>Reset token printed in backend console.<br />Check terminal and use /reset-password?token=...</p>
          : <form onSubmit={handleSubmit}>
              <input style={s.input} type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required />
              <button style={s.btn} type="submit">Send Reset Link</button>
            </form>
        }
        <p style={{ textAlign: 'center', marginTop: 16 }}><Link to="/login" style={s.link}>← Back to Login</Link></p>
      </div>
    </div>
  )
}

export const ResetPassword = () => {
  const [params] = useSearchParams()
  const [newPassword, setNewPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try { await resetPassword(params.get('token'), newPassword); toast.success('Password reset! Login now.'); navigate('/login') }
    catch { toast.error('Invalid or expired token') }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h2 style={s.title}>🔐 Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input style={s.input} type="password" placeholder="New password (min 6)" minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <button style={s.btn} type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a1a2e,#0f3460)' },
  card: { background: '#fff', padding: '40px 36px', borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,0.4)' },
  title: { textAlign: 'center', color: '#1a1a2e', marginBottom: 24 },
  input: { width: '100%', padding: '12px 14px', marginBottom: 14, border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' },
  btn: { width: '100%', padding: 13, background: 'linear-gradient(135deg,#1a1a2e,#0f3460)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 16, cursor: 'pointer', fontWeight: 600 },
  link: { color: '#4fc3f7', textDecoration: 'none', fontSize: 14 }
}
