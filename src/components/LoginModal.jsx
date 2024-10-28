import React, { useState } from 'react';
import { X } from 'lucide-react';

export function LoginModal({ onClose, onVerify, userEmail }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/auth/generate-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      
      alert('OTP sent to your email');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, otp })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      // Store auth token
      localStorage.setItem('authToken', data.token);
      onVerify();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Verify Your Email
        </h2>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We'll send a verification code to<br/>
            <span className="font-medium text-gray-800">{userEmail}</span>
          </p>
          
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Enter 4-digit OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              maxLength={4}
            />
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={otp.length !== 4 || loading}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <p className="text-sm text-center text-gray-600">
            Didn't receive the code? 
            <button 
              onClick={handleSendOTP} 
              disabled={loading}
              className="text-orange-500 hover:underline ml-1 disabled:text-gray-400"
            >
              {loading ? 'Sending...' : 'Resend'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
