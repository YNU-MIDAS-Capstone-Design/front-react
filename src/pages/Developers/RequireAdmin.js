import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RequireAdmin({ children }) {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div>로딩중...</div>;

  if (!isAdmin) {
    alert("관리자만 접근 가능합니다.");
    return <Navigate to="/" replace />;
  }

  return children;
}
