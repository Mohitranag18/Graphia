import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { send_otp } from '../api/endpoints';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const { registerUser } = useAuth();
  const nav = useNavigate();
  const { showToast } = useToast();

  const handleSendOtp = async () => {
    if (!email.endsWith('@gehu.ac.in')) {
      showToast("Only @gehu.ac.in student emails are allowed", "error");
      return;
    }
    if (password !== passwordConfirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }
    try {
      const res = await send_otp(email);
      if (res.success) {
        setOtpSent(true);
        showToast("OTP sent to your email", "success");
      }
    } catch (error) {
      showToast(error.response?.data?.error || "Failed to send OTP", "error");
    }
  };

  const handleRegister = async () => {
    await registerUser(username, email, password, passwordConfirm, otp);
  };

  const handleNavigate = () => {
    nav('/login');
  };

  return (
    <div className="flex items-start md:items-center justify-center min-h-screen py-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 m-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent mb-2 tracking-tight">Graphia</h1>
          <p className="text-slate-500 font-medium">Create your account to get started.</p>
        </div>
        <div className="mb-4">
          <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
            placeholder="Your username"
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
            placeholder="Your email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
            placeholder="Your password"
          />
        </div>
        <div className="mb-6">
          <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={otpSent}
            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300 disabled:opacity-50"
            placeholder="Confirm password"
          />
        </div>
        {otpSent && (
          <div className="mb-6">
            <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
              placeholder="Enter the 6-digit OTP"
            />
          </div>
        )}
        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Send OTP
          </button>
        ) : (
          <button
            onClick={handleRegister}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Verify & Register
          </button>
        )}
        <div className="text-center mt-6">
          <p
            onClick={handleNavigate}
            className="text-sm font-medium text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            Have an account? <span className="text-indigo-600">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
