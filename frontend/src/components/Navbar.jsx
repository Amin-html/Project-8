import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        AUTO<span>SALON</span>
      </Link>

      <div className="navbar-links">
        <Link to="/cars" className="navbar-link">Каталог</Link>

        {username ? (
          <>
            <Link to="/favorites" className="navbar-link">❤️ Избранное</Link>
            <Link to="/profile" className="navbar-link">👤 {username}</Link>
            <button
              onClick={() => { logout(); navigate('/') }}
              className="btn btn-outline btn-sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Войти</Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar