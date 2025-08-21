import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ authed, children }) {
  if (!authed) return <Navigate to="/login" replace />
  return children
}
