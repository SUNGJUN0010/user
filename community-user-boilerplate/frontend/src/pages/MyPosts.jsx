import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MyPosts(){
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // 실제로는 API에서 사용자의 글을 가져와야 함
    // 현재는 더미 데이터로 표시
    setTimeout(() => {
      setPosts([
        { id: 1, title: '첫 번째 게시글', content: '안녕하세요! 첫 번째 게시글입니다.', created_at: '2025-08-19' },
        { id: 2, title: '두 번째 게시글', content: '두 번째 게시글의 내용입니다.', created_at: '2025-08-18' },
        { id: 3, title: '세 번째 게시글', content: '세 번째 게시글입니다.', created_at: '2025-08-17' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

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
        <button
          onClick={() => navigate('/profile')}
          style={{
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          ← 프로필로 돌아가기
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <main style={{
        flex: 1,
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            📝 내가 작성한 글
          </h1>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              로딩 중...
            </div>
          ) : posts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <p>아직 작성한 글이 없습니다.</p>
              <p>첫 번째 글을 작성해보세요!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {posts.map(post => (
                <div
                  key={post.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    backgroundColor: '#fafafa'
                  }}
                >
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '12px',
                    lineHeight: '1.5'
                  }}>
                    {post.content}
                  </p>
                  <div style={{
                    fontSize: '14px',
                    color: '#999'
                  }}>
                    작성일: {post.created_at}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
