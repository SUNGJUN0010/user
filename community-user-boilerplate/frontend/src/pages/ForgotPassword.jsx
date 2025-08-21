import { useState } from 'react'
import { forgotPassword } from '../api/auth'

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const data = await forgotPassword(email)
      setMsg(data.message + (data.expires_min ? ` (유효기간 ${data.expires_min}분)` : ''))
    } catch (e){
      setMsg(e.response?.data?.message || '오류')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{display:'grid',gap:8,padding:16,maxWidth:360}}>
      <h2>비밀번호 찾기</h2>
      <input placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} />
      <button>재설정 링크 받기</button>
      <div>{msg}</div>
    </form>
  )
}
