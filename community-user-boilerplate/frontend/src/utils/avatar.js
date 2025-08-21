// 아바타 URL을 생성하는 유틸리티 함수
export const getAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null
  
  // 이미 전체 URL인 경우
  if (avatarUrl.startsWith('http')) {
    return avatarUrl
  }
  
  // 상대 경로인 경우 API 서버 URL과 결합
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  return `${apiBase}${avatarUrl}`
}

// 아바타 컴포넌트용 스타일 생성
export const getAvatarStyle = (avatarUrl, size = 32, fontSize = '14px') => {
  const backgroundImage = avatarUrl ? `url(${getAvatarUrl(avatarUrl)})` : 'none'
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    backgroundColor: '#1e3a8a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: fontSize,
    fontWeight: 'bold',
    backgroundImage: backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
}
