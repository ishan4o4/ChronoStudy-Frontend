import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";


const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef(null);


  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };


  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not log in. Check your details.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleCredentialResponse = async (response) => {
    try {
      setGoogleLoading(true);
      setError(null);
      const idToken = response.credential;
      const res = await api.post("/auth/google", { idToken });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      const message =
        err?.response?.data?.message || "Could not sign in/up with Google.";
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  };


  useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID || !googleButtonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      shape: "pill",
      width: "100%",
      text: "signin_with",
    });
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(circle_at_10%_20%,rgba(248,113,113,0.35),transparent_60%),radial-gradient(circle_at_80%_0,rgba(56,189,248,0.3),transparent_55%),radial-gradient(circle_at_50%_100%,rgba(190,242,100,0.25),transparent_55%)] relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>


      <div className="relative z-10 max-w-5xl w-full mx-4">
        <div className="grid gap-12 rounded-[2.5rem] border border-slate-800/60 bg-slate-950/80 p-8 shadow-[0_0_60px_rgba(15,23,42,0.9)] md:grid-cols-[1.2fr_1fr] md:p-10 lg:p-12 backdrop-blur-xl">
          {/* Left Section */}
          <div className="flex flex-col justify-between gap-10">
            {/* Header */}
            <header className="flex items-center gap-3 animate-fadeInDown">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-400 via-blue-400 to-lime-300 p-[2px]">
                <div className="h-full w-full rounded-2xl bg-slate-950/80 flex items-center justify-center text-xs font-mono text-slate-100">
                  ⏱️
                </div>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400">
                  ChronoStudy
                </p>
                <p className="text-sm text-slate-300">Your Neo Study Operating System</p>
              </div>
            </header>


            {/* Main Content */}
            <main className="space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                <span className="bg-gradient-to-r from-pink-400 via-blue-400 to-lime-300 bg-clip-text text-transparent animate-pulse">
                  Study in vibes,
                </span>
                <br />
                <span className="text-slate-50">not in chaos.</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300/90 max-w-md leading-relaxed">
                Turn your messy timetable into a clean, aesthetic dashboard. Track hours, crush
                deadlines, and keep your streaks alive all in one native workspace.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-300">
                <span className="px-3 py-1.5 border border-slate-700 rounded-full bg-slate-900/50 backdrop-blur hover:border-blue-400 transition-colors">
                  ⚡ Live stats
                </span>
                <span className="px-3 py-1.5 border border-slate-700 rounded-full bg-slate-900/50 backdrop-blur hover:border-blue-400 transition-colors">
                  🔥 Streaks & vibes
                </span>
                <span className="px-3 py-1.5 border border-slate-700 rounded-full bg-slate-900/50 backdrop-blur hover:border-blue-400 transition-colors">
                  📅 Calendar x To-Do
                </span>
              </div>
            </main>


            {/* Footer */}
            <footer className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/50 pt-6">
              <p>Made by Ishan for students who live in tabs and playlists. ✨</p>
              <div className="hidden md:flex gap-1 text-[10px] font-mono uppercase tracking-[0.3em] text-slate-600">
                <span className="h-1 w-10 rounded-full bg-gradient-to-r from-pink-400 to-blue-400" />
                <span>v1.0</span>
              </div>
            </footer>
          </div>


          {/* Right Section - Login Form */}
          <div className="neo-card px-6 py-7 md:px-7 md:py-8 border border-slate-800/60 rounded-2xl bg-slate-950/80 backdrop-blur-xl shadow-xl animate-fadeInUp">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-slate-50">
                Welcome back, brainiac ✨
              </h2>
            </div>


            <div className="space-y-4">
              {/* Google OAuth Button - Using Google's Official Button */}
              <div className="flex flex-col items-center gap-2">
                <div 
                  ref={googleButtonRef}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                  }}
                />
                {googleLoading && (
                  <p className="text-[11px] text-slate-400 animate-pulse">Connecting to Google…</p>
                )}
              </div>


              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-slate-700/50" />
                <span className="text-[10px] text-slate-500 font-medium">or email</span>
                <div className="h-px flex-1 bg-slate-700/50" />
              </div>


              {/* Email/Password Login Form */}
              <form onSubmit={onSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-3.5 py-2.5 border border-slate-700 rounded-lg bg-slate-900/60 text-slate-50 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 backdrop-blur"
                    placeholder="you@campus.edu"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>


                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full px-3.5 py-2.5 border border-slate-700 rounded-lg bg-slate-900/60 text-slate-50 text-sm placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 backdrop-blur"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={onChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 text-sm"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>


                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] animate-shake">
                    {error}
                  </div>
                )}


                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-sm shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    "Log In"
                  )}
                </button>
              </form>

              {/* Sign up hint */}
              <p className="text-xs text-center text-slate-400 mt-4">
                Don't have an account? Use Google to create one instantly
              </p>
            </div>
          </div>
        </div>


        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-500">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4z" clipRule="evenodd" />
          </svg>
          <span>Your data is encrypted and secure</span>
        </div>
      </div>


      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }


        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out;
        }


        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }


        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }


        .neo-card {
          transition: all 0.3s ease;
        }


        .neo-card:hover {
          border-color: rgba(56, 189, 248, 0.3);
        }
      `}</style>
    </div>
  );
};


export default Login;