import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate(`/login?error=${error}`);
      return;
    }

    if (token) {
      loginWithToken(token)
        .then(() => navigate("/dashboard"))
        .catch(() => navigate("/login?error=auth_failed"));
    } else {
      navigate("/login");
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Completing sign-in…</p>
      </div>
    </div>
  );
}
