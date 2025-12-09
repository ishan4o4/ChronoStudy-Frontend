import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    vibe: "neo-neon"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not create account. Try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="signup">
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Your name</label>
          <input
            type="text"
            name="username"
            className="neo-input w-full"
            placeholder="e.g. Ishan Jaiswal"
            value={form.username}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="neo-input w-full"
            placeholder="you@campus.edu"
            value={form.email}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="neo-input w-full"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Vibe</label>
          <select
            name="vibe"
            className="neo-input w-full"
            value={form.vibe}
            onChange={onChange}
          >
            <option value="neo-neon">Neo-Neon</option>
            <option value="pastel-dream">Pastel Dream</option>
            <option value="terminal-core">Terminal Core</option>
          </select>
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        <button className="neo-button w-full mt-3" disabled={loading}>
          {loading ? "Creating workspace..." : "Launch my study OS"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;