import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword } from '../services/authService'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user, saveUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', phone: '' })
  const [pwd, setPwd] = useState({ oldPassword: '', newPassword: '' })

  const handleProfile = async e => {
    e.preventDefault()
    try { const { data } = await updateProfile(profile); saveUser({ ...user, fullName: data.fullName }, localStorage.getItem('token')); toast.success('Profile updated!') }
    catch { toast.error('Update failed') }
  }

  const handlePassword = async e => {
    e.preventDefault()
    try { await changePassword(pwd); toast.success('Password changed!'); setPwd({ oldPassword: '', newPassword: '' }) }
    catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }

  return (
    <div style={s.page}>
      <h2 style={s.heading}>👤 Profile</h2>
      <div style={s.card}>
        <div style={s.avatarWrap}>
          <div style={s.avatar}>{user?.fullName?.[0]?.toUpperCase()}</div>
          <div>
            <h3 style={{margin:'0 0 4px',color:'#1a1a2e'}}>{user?.fullName}</h3>
            <p style={{margin:0,color:'#888',fontSize:14}}>{user?.email}</p>
            <span style={{...s.roleBadge, background: user?.role==='ADMIN' ? '#ab47bc' : '#4fc3f7'}}>{user?.role}</span>
          </div>
        </div>

        <div style={s.tabs}>
          {[['profile','✏️ Edit Profile'],['password','🔑 Change Password']].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{...s.tabBtn, background: tab===k ? '#1a1a2e' : '#f5f5f5', color: tab===k ? '#fff' : '#333'}}>{l}</button>
          ))}
        </div>

        {tab === 'profile' && (
          <form onSubmit={handleProfile}>
            <label style={s.label}>Full Name</label>
            <input style={s.input} value={profile.fullName} onChange={e => setProfile({...profile, fullName: e.target.value})} placeholder="Your full name" />
            <label style={s.label}>Phone</label>
            <input style={s.input} value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} placeholder="Your phone number" />
            <button style={s.btn} type="submit">Save Changes</button>
          </form>
        )}

        {tab === 'password' && (
          <form onSubmit={handlePassword}>
            <label style={s.label}>Current Password</label>
            <input style={s.input} type="password" value={pwd.oldPassword} onChange={e => setPwd({...pwd, oldPassword: e.target.value})} required />
            <label style={s.label}>New Password</label>
            <input style={s.input} type="password" value={pwd.newPassword} onChange={e => setPwd({...pwd, newPassword: e.target.value})} minLength={6} required />
            <button style={s.btn} type="submit">Update Password</button>
          </form>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { padding:24, maxWidth:520, margin:'0 auto' },
  heading: { color:'#1a1a2e', marginBottom:20, fontSize:24 },
  card: { background:'#fff', padding:32, borderRadius:16, boxShadow:'0 4px 24px rgba(0,0,0,0.1)' },
  avatarWrap: { display:'flex', alignItems:'center', gap:16, marginBottom:24, paddingBottom:24, borderBottom:'1px solid #f0f0f0' },
  avatar: { width:72, height:72, borderRadius:'50%', background:'linear-gradient(135deg,#1a1a2e,#0f3460)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:700, flexShrink:0 },
  roleBadge: { display:'inline-block', padding:'3px 10px', borderRadius:20, color:'#fff', fontSize:11, fontWeight:700, marginTop:6 },
  tabs: { display:'flex', gap:8, marginBottom:20 },
  tabBtn: { flex:1, padding:'10px', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600, fontSize:14, transition:'all 0.2s' },
  label: { display:'block', marginBottom:6, fontWeight:600, color:'#444', fontSize:14 },
  input: { width:'100%', padding:'11px 14px', marginBottom:16, border:'1.5px solid #e0e0e0', borderRadius:8, fontSize:15, boxSizing:'border-box' },
  btn: { width:'100%', padding:13, background:'linear-gradient(135deg,#1a1a2e,#0f3460)', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:15, fontWeight:600 }
}

export default Profile
