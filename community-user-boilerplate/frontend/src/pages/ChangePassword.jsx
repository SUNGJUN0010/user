import { useState } from 'react'
import { changePassword } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function ChangePassword(){
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const current_password = e.target.current.value
    const new_password = e.target.newpw.value
    setMsg('')
    
    try {
      const data = await changePassword({ current_password, new_password })
      setMsg(data.message)
      e.target.reset()
    } catch (e){ 
      setMsg(e.response?.data?.message || '오류') 
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '48px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '480px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          🔐 비밀번호 변경
        </h1>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '16px' }}>
          <input 
            name="current" 
            placeholder="현재 비밀번호" 
            type="password" 
            required
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <input 
            name="newpw" 
            placeholder="새 비밀번호" 
            type="password" 
            required
            style={{
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#1e3a8a',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1e40af'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1e3a8a'}
          >
            비밀번호 변경
          </button>
        </form>

        {msg && (
          <div style={{
            marginTop: '24px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: msg.includes('오류') ? '#fef2f2' : '#f0fdf4',
            color: msg.includes('오류') ? '#dc2626' : '#16a34a',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {msg}
          </div>
        )}

        <button
          onClick={() => navigate('/profile')}
          style={{
            marginTop: '24px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          ← 프로필로 돌아가기
        </button>
      </div>
    </div>
  )
}
