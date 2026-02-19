'use client';

import { useAuth } from '../app/context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../app/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Vapi Assistant
            </Link>
          </div>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Vapi Assistant
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">
                  Witaj, {user.displayName || user.email}
                </span>
                <Link 
                  href="/dashboard"
                  className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {logoutLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Wylogowywanie...
                    </div>
                  ) : (
                    'Wyloguj się'
                  )}
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link 
                  href="/login"
                  className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md"
                >
                  Zaloguj się
                </Link>
                <Link 
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Zarejestruj się
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}