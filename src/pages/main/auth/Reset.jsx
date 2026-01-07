/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoadingSpinner } from "../../../components/Spinner";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const token = searchParams.get("access_token");
    setValidToken(!!token);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    }
  };

  if (!validToken) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-secondary mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-sm text-secondary opacity-70 mb-6">
            This reset link has expired or is invalid. Please request a new one.
          </p>
          <a
            href="/auth/forgot-password"
            className="inline-block py-3 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90"
          >
            Request New Link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Create New Password
          </h1>
          <p className="text-sm text-secondary opacity-70">
            Enter a strong password for your account
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-green-100 border border-green-300 rounded-sm text-center">
            <h2 className="font-semibold text-green-800 mb-2">Success!</h2>
            <p className="text-sm text-green-700">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-xs text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
