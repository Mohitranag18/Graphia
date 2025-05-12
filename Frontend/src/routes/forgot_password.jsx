import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request_password_reset } from '../api/endpoints';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [linkSended, setLinkSended] = useState(false);

  const nav = useNavigate();

  const handleNavigate = (route) => {
    nav(`${route}`);
  };

  const requestResetPassword = async () => {
    try {
      const response = await request_password_reset(email); 
      setMessage(response.success);
      setLinkSended(true);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error sending reset link"); 
      setLinkSended(false);
      console.error("Error in Sending Reset Link", error);
    }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Forgot Password</h1>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Your Registered Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-center p-4">
          {linkSended ? (
            <p className="text-green-500">{message}</p>
          ) : (
            <p className="text-red-500">{message}</p>
          )}
        </div>

        <button
          onClick={requestResetPassword}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Send Reset Link
        </button>

        <div className="flex justify-between mt-4">
          <p
            onClick={() => handleNavigate('/login')}
            className="text-sm text-gray-600 cursor-pointer hover:text-blue-500"
          >
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
