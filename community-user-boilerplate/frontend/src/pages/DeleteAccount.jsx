import { useState } from 'react'
import { deleteAccount, clearAccessToken } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function DeleteAccount({ setUser }){
  const [msg, setMsg] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const onDeleteAccount = async () => {
    if (!window.confirm('정말로 회원탈퇴를 하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.')) {
      return
    }
    
    setIsDeleting(true)
    setMsg('')
    
    try {
      await deleteAccount()
      setMsg('회원탈퇴가 완료되었습니다.')
      
      // 사용자 상태와 토큰 정리
      setUser(null)
      clearAccessToken()
      
      // 브라우저 로컬 스토리지 정리
      localStorage.clear()
      sessionStorage.clear()
      
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (e) {
      setMsg(e.response?.data?.message || '회원탈퇴 중 오류가 발생했습니다.')
      setIsDeleting(false)
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
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          margin: '0 auto 24px auto'
        }}>
          ⚠️
        </div>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '16px'
        }}>
          계정 탈퇴
        </h1>

        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px'
        }}>
          <h3 style={{
            color: '#dc2626',
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>
            주의사항
          </h3>
          <ul style={{
            color: '#dc2626',
            textAlign: 'left',
            lineHeight: '1.6',
            fontSize: '14px'
          }}>
            <li>모든 개인정보가 영구적으로 삭제됩니다</li>
            <li>작성한 모든 게시글과 댓글이 삭제됩니다</li>
            <li>이 작업은 되돌릴 수 없습니다</li>
            <li>탈퇴 후에는 같은 이메일로 재가입이 제한될 수 있습니다</li>
          </ul>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <button
            onClick={onDeleteAccount}
            disabled={isDeleting}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: isDeleting ? 0.6 : 1
            }}
            onMouseOver={(e) => !isDeleting && (e.target.style.backgroundColor = '#b91c1c')}
            onMouseOut={(e) => !isDeleting && (e.target.style.backgroundColor = '#dc2626')}
          >
            {isDeleting ? '처리 중...' : '🗑️ 계정 탈퇴하기'}
          </button>

          <button
            onClick={() => navigate('/profile')}
            disabled={isDeleting}
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              padding: '16px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              opacity: isDeleting ? 0.6 : 1
            }}
          >
            ← 프로필로 돌아가기
          </button>
        </div>

        {msg && (
          <div style={{
            marginTop: '24px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: msg.includes('완료') ? '#f0fdf4' : '#fef2f2',
            color: msg.includes('완료') ? '#16a34a' : '#dc2626',
            fontSize: '14px'
          }}>
            {msg}
          </div>
        )}
      </div>
    </div>
  )
}
