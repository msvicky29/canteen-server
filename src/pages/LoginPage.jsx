import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import foodBg from '../assets/food-bg.jpg'
import logo from '../assets/logo.jpg'
import { LoginModal } from '../components/LoginModal'

const LoginPage = () => {
  const navigate = useNavigate()
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email && password) {
      try {
        setLoading(true)
        setError('')
        
        // Verify credentials and send OTP
        const response = await fetch('https://canteen-server-kyek.onrender.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Failed to send OTP')
        }

        setShowOtpModal(true)
        console.log('OTP sent successfully')
      } catch (error) {
        setError(error.message)
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleOtpVerified = () => {
    localStorage.setItem('isAuthenticated', 'true')
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen bg-teal-50">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-24">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <img src={logo} alt="Canteen Management System Logo" className="w-28" />
          <h1 className='text-xl text-center md:text-2xl font-bold'>AVC College of Engineering</h1>
        </div>
        
        <div className="flex-grow flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-2">Login</h2>
          <p className="text-gray-600 mb-8">Welcome to the Canteen Management System</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="mail@college.edu"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                placeholder="Min. 8 characters"
                required
              />
            </div>
            <div className="flex items-center justify-between mb-6">
              <a href="#" className="text-sm text-orange-500 hover:underline">Forgot password?</a>
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-orange-600 transition-colors disabled:bg-orange-300"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Login'}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-gray-500">
          © Canteen Management System. All rights reserved.
        </p>
      </div>
      
      {/* Right side - Food Background Image */}
      <div className="hidden lg:block w-1/2 bg-orange-500 relative overflow-hidden">
        <img src={foodBg} alt="Food Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-orange-500 bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4 text-white">Canteen Management System</h2>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <LoginModal
          onClose={() => setShowOtpModal(false)}
          onVerify={handleOtpVerified}
          userEmail={email}
        />
      )}
    </div>
  )
}

export default LoginPage
