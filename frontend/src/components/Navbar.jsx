import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faBars, faTimes, faUser, faSignOutAlt, faTachometerAlt, faKeyboard, faFileAlt, faHistory, faShieldAlt } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={s.nav}>
      <Link to="/dashboard" style={s.brand}>
        <FontAwesomeIcon icon={faBrain} style={{ marginRight: 8 }} />
        AI Interview Prep
      </Link>
      <button style={s.toggle} className="nav-toggle" onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={open ? faTimes : faBars} />
      </button>
      <div style={{ ...s.links, display: open ? 'flex' : 'flex' }} className={open ? 'nav-open' : 'nav-closed'}>
        {user && <>
          <NavLink to="/dashboard" icon={faTachometerAlt} label="Dashboard" onClick={() => setOpen(false)} />
          <NavLink to="/interview" icon={faKeyboard} label="Practice" onClick={() => setOpen(false)} />
          <NavLink to="/resume" icon={faFileAlt} label="Resume" onClick={() => setOpen(false)} />
          <NavLink to="/history" icon={faHistory} label="History" onClick={() => setOpen(false)} />
          {user.role === 'ADMIN' && <NavLink to="/admin" icon={faShieldAlt} label="Admin" onClick={() => setOpen(false)} />}
          <Link to="/profile" style={s.link} onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: 4 }} />{user.fullName?.split(' ')[0]}
          </Link>
          <button onClick={handleLogout} style={s.logoutBtn}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 4 }} />Logout
          </button>
        </>}
      </div>
    </nav>
  )
}

const NavLink = ({ to, icon, label, onClick }) => (
  <Link to={to} style={s.link} onClick={onClick}>
    <FontAwesomeIcon icon={icon} style={{ marginRight: 4 }} />{label}
  </Link>
)

const s = {
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#1a1a2e', color: '#fff', position: 'sticky', top: 0, zIndex: 1000, flexWrap: 'wrap', gap: 8 },
  brand: { color: '#4fc3f7', textDecoration: 'none', fontSize: 20, fontWeight: 'bold' },
  links: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  link: { color: '#e0e0e0', textDecoration: 'none', fontSize: 14, padding: '6px 10px', borderRadius: 6, transition: 'background 0.2s' },
  logoutBtn: { background: '#e53935', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  toggle: { display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }
}

export default Navbar
