import React from 'react'
import { useNavigate } from 'react-router-dom';

function ResetPassword() {

  const nav = useNavigate();

    const handleNavigate = (route) => {
        nav(`${route}`);
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Reset Password</h1>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">New Password</label>
          <input
            type="text"
            placeholder="Enter New Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Confirm Password</label>
          <input
            type="=text"
            placeholder="Enter New Password Again"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Reset Password
        </button>
        <div className='flex'>
        <p
          className="mt-4 text-sm text-gray-600 cursor-pointer hover:text-blue-500"
          onClick={(route)=> handleNavigate('/login')}
        >
          Go to Login
        </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword