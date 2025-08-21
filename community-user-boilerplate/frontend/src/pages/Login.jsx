import { useState } from 'react'
import { login } from '../api/auth'
import { Link, useNavigate } from 'react-router-dom'

export default function Login({ onAuthed }){
  const [form, setForm] = useState({ email_or_username:'', password:'' })
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const data = await login(form)
      onAuthed(data.user)
      nav('/profile')
    } catch (e){
      setMsg(e.response?.data?.message || '오류')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{display:'grid',gap:8,padding:16,maxWidth:360}}>
      <h2>로그인</h2>
      <input placeholder="이메일 또는 아이디" value={form.email_or_username} onChange={e=>setForm({...form,email_or_username:e.target.value})} />
      <input placeholder="비밀번호" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <button>로그인</button>
      <div>{msg}</div>
      <div style={{display:'flex', gap:16, justifyContent:'center'}}>
        <Link to="/forgot-username">아이디 찾기</Link>
        <Link to="/forgot-password">비밀번호 찾기</Link>
      </div>
    </form>
  )
}
