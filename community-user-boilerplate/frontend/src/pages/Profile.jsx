import { useState, useRef } from 'react'
import { updateMe, changePassword, deleteAccount, uploadAvatar } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { getAvatarStyle } from '../utils/avatar'

export default function Profile({ user, setUser }){
  const [msg, setMsg] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
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

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // 파일 크기 검사 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setMsg('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 파일 형식 검사
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setMsg('지원하는 파일 형식: JPG, PNG, GIF')
      return
    }

    setIsUploading(true)
    setMsg('')

    try {
      const result = await uploadAvatar(file)
      setUser({ ...user, avatar_url: result.avatar_url })
      setMsg(result.message)
    } catch (error) {
      setMsg(error.response?.data?.message || '업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
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
          {/* 사용자 아이콘 */}
          <div style={{
            position: 'relative',
            margin: '0 auto 24px auto',
            display: 'inline-block'
          }}>
            <div style={{
              ...getAvatarStyle(user?.avatar_url, 80, '32px'),
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}
            onClick={triggerFileInput}
            >
              {!user?.avatar_url && user?.username?.charAt(0).toUpperCase()}
            </div>
            
            {/* 편집 아이콘 */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
            onClick={triggerFileInput}
            >
              <span style={{ fontSize: '12px', color: 'white' }}>
                {isUploading ? '⏳' : '✏️'}
              </span>
            </div>
          </div>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />

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
    </div>
  )
}
