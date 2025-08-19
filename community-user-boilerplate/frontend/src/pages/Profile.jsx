import { useState } from 'react'
import { updateMe, changePassword, deleteAccount } from '../api/auth'
import { useNavigate } from 'react-router-dom'

export default function Profile({ user, setUser }){
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const onDeleteAccount = async () => {
    if (!window.confirm('정말로 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }
    
    setMsg('')
    try {
      await deleteAccount()
      setUser(null)
      navigate('/')
      setMsg('회원탈퇴가 완료되었습니다.')
    } catch (e) {
      setMsg(e.response?.data?.message || '회원탈퇴 중 오류가 발생했습니다.')
    }
  }

  const handlePasswordChange = () => {
    navigate('/change-password')
  }

  const handleMyPosts = () => {
    navigate('/my-posts')
  }

  const handleDeleteAccount = () => {
    navigate('/delete-account')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 상단 헤더 */}
      <header style={{
        backgroundColor: 'white',
        padding: '16px 24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
          Community
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: '500', color: '#333' }}>
            {user?.username}
          </span>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={{
        flex: 1,
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
          {/* 사용자 아이콘 */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '0 auto 24px auto'
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          {/* 환영 메시지 */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            Welcome, {user?.username}!
          </h1>
          <p style={{
            color: '#666',
            marginBottom: '40px',
            fontSize: '16px'
          }}>
            내 정보를 관리하고 활동을 확인해보세요
          </p>

          {/* 버튼 그룹 */}
          <div style={{ display: 'grid', gap: '16px' }}>
            <button
              onClick={handlePasswordChange}
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1e40af'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1e3a8a'}
            >
              🔐 비밀번호 변경
            </button>

            <button
              onClick={handleMyPosts}
              style={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1e40af'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1e3a8a'}
            >
              📝 작성글 조회
            </button>

            <button
              onClick={handleDeleteAccount}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              🗑️ 계정 탈퇴
            </button>
          </div>

          {msg && (
            <div style={{
              marginTop: '24px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: msg.includes('오류') ? '#fef2f2' : '#f0fdf4',
              color: msg.includes('오류') ? '#dc2626' : '#16a34a',
              fontSize: '14px'
            }}>
              {msg}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
