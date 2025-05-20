import { Navigate } from "react-router-dom";
import { type ReactNode } from "react"; // ✅ Type-only import for ReactNode
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { accessToken } = useAuth(); // ✅ This is used
  return accessToken ? <>{children}</> : <Navigate to="/login" />;
}
