import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginUser } = useAuth();
  const nav = useNavigate();

  const handleLogin = async () => {
    await loginUser(username, password);
  };

  const handleNavigate = (route) => {
    nav(`${route}`);
  };

  return (
    <div className="flex items-start md:items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 m-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent mb-2 tracking-tight">Graphia</h1>
          <p className="text-slate-500 font-medium">Welcome back! Sign in to continue.</p>
        </div>
        <div className="mb-5">
          <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">Username</label>
          <input
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
          />
        </div>
        <div className="mb-8">
          <label className="block text-slate-600 text-sm font-semibold mb-2 ml-1">Password</label>
          <input
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all duration-300"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          Login
        </button>
        <div className='flex flex-col md:flex-row justify-between items-center mt-6'>
          <p
            onClick={() => handleNavigate('/register')}
            className="text-sm font-medium text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            Don't have an account? <span className="text-indigo-600">Sign up</span>
          </p>
          <p
            onClick={() => handleNavigate('/forgotPassword')}
            className="mt-4 md:mt-0 text-sm font-medium text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
