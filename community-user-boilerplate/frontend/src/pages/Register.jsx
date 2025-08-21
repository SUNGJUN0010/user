import { useState } from 'react'
import { register } from '../api/auth'

export default function Register(){
  const [form, setForm] = useState({ username:'', email:'', password:'' })
  const [msg, setMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await register(form)
      setMsg('가입 완료! 이제 로그인하세요.')
    } catch (e){
      setMsg(e.response?.data?.message || '오류')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{display:'grid',gap:8,padding:16,maxWidth:360}}>
      <h2>회원가입</h2>
      <input placeholder="아이디" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} />
      <input placeholder="이메일" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input placeholder="비밀번호" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <button>가입</button>
      <div>{msg}</div>
    </form>
  )
}
