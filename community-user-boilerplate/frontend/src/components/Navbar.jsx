import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { getAvatarStyle } from '../utils/avatar'

export default function Navbar({ authed, user, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await onLogout()
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const handleProfileClick = () => {
    navigate('/profile')
    setIsDropdownOpen(false)
  }

  return (
    <nav style={{
      display: 'flex',
      gap: 12,
      padding: '12px 24px',
      borderBottom: '1px solid #ddd',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link 
          to="/community" 
          style={{
            textDecoration: 'none',
            color: '#333',
            fontWeight: '500',
            fontSize: '16px'
          }}
        >
          홈
        </Link>
        {!authed && (
          <>
            <Link 
              to="/login"
              style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: '500',
                fontSize: '16px'
              }}
            >
              로그인
            </Link>
            <Link 
              to="/register"
              style={{
                textDecoration: 'none',
                color: '#333',
                fontWeight: '500',
                fontSize: '16px'
              }}
            >
              회원가입
            </Link>
          </>
        )}
      </div>
      
      {authed && (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          {/* 프로필 아바타 버튼 */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div style={getAvatarStyle(user?.avatar_url, 32, '14px')}>
              {!user?.avatar_url && user?.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* 드롭다운 메뉴 */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              minWidth: '200px',
              zIndex: 1000,
              marginTop: '4px'
            }}>
              {/* 사용자 정보 섹션 */}
              <div style={{
                padding: '16px',
                borderBottom: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{
                  ...getAvatarStyle(user?.avatar_url, 48, '18px'),
                  margin: '0 auto 8px auto'
                }}>
                  {!user?.avatar_url && user?.username?.charAt(0).toUpperCase()}
                </div>
                <div style={{
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '14px',
                  marginBottom: '4px'
                }}>
                  {user?.username}
                </div>
                <div style={{
                  color: '#666',
                  fontSize: '12px'
                }}>
                  {user?.email}
                </div>
              </div>

              {/* 메뉴 옵션 */}
              <div style={{ padding: '8px' }}>
                <button
                  onClick={handleProfileClick}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#333',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  내 정보
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
