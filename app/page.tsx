'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Ustaw timeout na początkowe ładowanie
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000); // 3 sekundy timeout

    if (!loading) {
      clearTimeout(timer);
      setInitialLoading(false);
    }

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading && !initialLoading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, initialLoading, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-red-600 text-xl font-bold mb-4">Błąd</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  if (loading || initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
          {initialLoading && (
            <button 
              onClick={() => setInitialLoading(false)}
              className="mt-4 text-indigo-600 underline text-sm"
            >
              Pomiń ładowanie
            </button>
          )}
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Przekierowywanie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
         
          <div className="space-x-4">
            <Link
              href="/register"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Zarejestruj się
            </Link>
            <Link
              href="/login"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Zaloguj się
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}