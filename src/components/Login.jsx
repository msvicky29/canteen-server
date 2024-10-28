import React, { useState } from 'react';
import { Coffee } from 'lucide-react';
import { LoginModal } from './LoginModal';

export function Login({ onLoginSuccess }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col items-center">
          <Coffee className="text-orange-500 w-16 h-16" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Canteen Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Login to manage your canteen menu
          </p>
        </div>

        <button
          onClick={() => setShowLoginModal(true)}
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Login with Phone
        </button>
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onVerify={onLoginSuccess}
        />
      )}
    </div>
  );
}
