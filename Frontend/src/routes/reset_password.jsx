import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { reset_password } from '../api/endpoints';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [newPassword2, setNewPassword2] = useState('')
  const [message, setMessage] = useState('')
  const [isReset, setIsReset] = useState(false)


  const nav = useNavigate();

  const handleNavigate = (route) => {
      nav(`${route}`);
  };

  const getTokenFromUrl = () => {
    const urlSplit = window.location.pathname.split('/');
    return urlSplit[urlSplit.length - 1];
  };
  const getUsernameFromUrl = () => {
    const urlSplit = window.location.pathname.split('/');
    return urlSplit[urlSplit.length - 2];
  };

  const [token, setToken] = useState(getTokenFromUrl());
  const [username, setUsername] = useState(getUsernameFromUrl());

  const ResetPassword = async () => {
    if(newPassword != newPassword2){
      setMessage("Your Passwords are not Matching")
      setIsReset(false)
      return
    }
    try {
      const response = await reset_password(username, token, newPassword) 
      setMessage(response.success);
      setIsReset(true)
    } catch (error) {
      setMessage(error.response?.data?.error || "Error in reset password"); 
      setIsReset(false)
      console.error("Error in Reset password", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-700 mb-8">Reset Password</h1>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">New Password</label>
          <input
            onChange={(e) => {setNewPassword(e.target.value)}}
            type="text"
            placeholder="Enter New Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Confirm Password</label>
          <input
            onChange={(e) => {setNewPassword2(e.target.value)}}
            type="=text"
            placeholder="Enter New Password Again"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className='flex justify-center p-4'>
          {
            isReset ?
              <p className='text-green-500'>{message}</p>
            :
              <p className='text-red-500'>{message}</p>
          }
        </div>


        <button
          onClick={ResetPassword} 
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