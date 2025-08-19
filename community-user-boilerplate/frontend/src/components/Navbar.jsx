import { Link } from 'react-router-dom'

export default function Navbar({ authed, onLogout }) {
  return (
    <nav style={{display:'flex',gap:12,padding:12,borderBottom:'1px solid #ddd'}}>
      <Link to="/">홈</Link>
      {!authed && <Link to="/login">로그인</Link>}
      {!authed && <Link to="/register">회원가입</Link>}
      {authed && <Link to="/profile">내 정보</Link>}
      {authed && <button onClick={onLogout}>로그아웃</button>}
    </nav>
  )
}
