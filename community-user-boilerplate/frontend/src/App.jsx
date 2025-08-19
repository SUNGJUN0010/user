import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { me, logout } from './api/auth'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ForgotUsername from './pages/ForgotUsername'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import ChangePassword from './pages/ChangePassword'
import MyPosts from './pages/MyPosts'
import DeleteAccount from './pages/DeleteAccount'

export default function App(){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await me()
        setUser(data.user)
      } catch (_) {}
      setLoading(false)
    })()
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  if (loading) return <div>로딩중...</div>

  return (
    <div>
      <Navbar authed={!!user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<div style={{padding:16}}>메인(커뮤니티 홈 예정) <Link to="/profile">내 정보</Link></div>} />
        <Route path="/login" element={<Login onAuthed={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={
          <ProtectedRoute authed={!!user}>
            <Profile user={user} setUser={setUser} />
          </ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute authed={!!user}>
            <ChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/my-posts" element={
          <ProtectedRoute authed={!!user}>
            <MyPosts />
          </ProtectedRoute>
        } />
        <Route path="/delete-account" element={
          <ProtectedRoute authed={!!user}>
            <DeleteAccount />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}
