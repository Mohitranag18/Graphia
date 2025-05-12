import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const { registerUser } = useAuth();
  const nav = useNavigate();

  const handleRegister = async () => {
    await registerUser(username, email, password, passwordConfirm);
  };

  const handleNavigate = () => {
    nav('/login');
  };

  return (
    <div className="flex items-start md:items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-white p-8 ">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">Register</h1>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your username here"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your email here"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Your password here"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 text-sm mb-2">Confirm Password</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirm password here"
          />
        </div>
        <button
          onClick={handleRegister}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Register
        </button>
        <p
          onClick={handleNavigate}
          className="mt-4 text-sm text-gray-600 cursor-pointer hover:underline"
        >
          Have an account? Sign in
        </p>
      </div>
    </div>
  );
};

export default Register;
