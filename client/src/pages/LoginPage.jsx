import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup-step1" | "signup-step2"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupStep1, setSignupStep1] = useState({ fullName: "", email: "", password: "" });
  const [signupStep2, setSignupStep2] = useState({ bio: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginForm);
      toast.success("Welcome back!");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupStep1 = (e) => {
    e.preventDefault();
    setError("");
    if (!signupStep1.fullName || !signupStep1.email || !signupStep1.password) {
      setError("All fields are required.");
      return;
    }
    if (signupStep1.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setMode("signup-step2");
  };

  const handleSignupStep2 = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ ...signupStep1, bio: signupStep2.bio });
      toast.success("Account created successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Signup failed. Please try again.";
      setError(msg);
      toast.error(msg);
      setMode("signup-step1");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">ChatApp</h1>
          <p className="text-slate-400 mt-1 text-sm">Real-time messaging for everyone</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
          {/* Mode Tabs */}
          {mode !== "signup-step2" && (
            <div className="flex bg-slate-700/50 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setMode("login"); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "login"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode("signup-step1"); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === "signup-step1"
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : "Sign In"}
              </button>
            </form>
          )}

          {/* SIGNUP STEP 1 */}
          {mode === "signup-step1" && (
            <form onSubmit={handleSignupStep1} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={signupStep1.fullName}
                  onChange={(e) => setSignupStep1({ ...signupStep1, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={signupStep1.email}
                  onChange={(e) => setSignupStep1({ ...signupStep1, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={signupStep1.password}
                  onChange={(e) => setSignupStep1({ ...signupStep1, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition mt-2"
              >
                Next →
              </button>
            </form>
          )}

          {/* SIGNUP STEP 2 */}
          {mode === "signup-step2" && (
            <form onSubmit={handleSignupStep2} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white">One more step!</h2>
                <p className="text-slate-400 text-sm mt-1">Add a bio to personalize your profile</p>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Bio (optional)</label>
                <textarea
                  value={signupStep2.bio}
                  onChange={(e) => setSignupStep2({ bio: e.target.value })}
                  placeholder="Tell others a bit about yourself..."
                  rows={3}
                  maxLength={150}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition resize-none"
                />
                <p className="text-right text-xs text-slate-500 mt-1">{signupStep2.bio.length}/150</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode("signup-step1")}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Create Account"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
