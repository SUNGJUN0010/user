import { useState } from 'react'
import { forgotUsername } from '../api/auth'
import { Link } from 'react-router-dom'

export default function ForgotUsername(){
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    try {
      await forgotUsername(email)
      setIsSubmitted(true)
      setMsg('이메일로 아이디가 발송되었습니다.')
    } catch (e){
      setMsg(e.response?.data?.message || '오류')
    }
  }

  return (
    <form onSubmit={onSubmit} style={{display:'grid',gap:8,padding:16,maxWidth:360}}>
      <h2>아이디 찾기</h2>
      {!isSubmitted ? (
        <>
          <input 
            placeholder="이메일" 
            type="email" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required
          />
          <button>아이디 찾기</button>
        </>
      ) : (
        <div style={{textAlign:'center'}}>
          <p>입력하신 이메일로 아이디가 발송되었습니다.</p>
          <p>이메일을 확인해주세요.</p>
        </div>
      )}
      <div>{msg}</div>
      <Link to="/login">로그인으로 돌아가기</Link>
    </form>
  )
}
