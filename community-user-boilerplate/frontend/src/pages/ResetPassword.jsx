import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../api/auth'

export default function ResetPassword(){
  const [params] = useSearchParams()
  const [token, setToken] = useState('')
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const nav = useNavigate()

  useEffect(()=>{ setToken(params.get('token') || '') }, [params])

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      const data = await resetPassword({ token, new_password: pw })
      setMsg(data.message)
      setTimeout(()=> nav('/login'), 1200)
    } catch (e){
      setMsg(e.response?.data?.message || '오류')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{display:'grid',gap:8,padding:16,maxWidth:360}}>
      <h2>비밀번호 재설정</h2>
      <input placeholder="토큰" value={token} onChange={e=>setToken(e.target.value)} />
      <input placeholder="새 비밀번호" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      <button>변경</button>
      <div>{msg}</div>
    </form>
  )
}
