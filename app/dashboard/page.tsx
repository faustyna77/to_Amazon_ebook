'use client';

import VapiAssistant from '@/components/VapiAssistant';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  // Zastąp swoimi danymi z Vapi
  const VAPI_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY || 'your_public_api_key_here';
  const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || 'your_assistant_id_here';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Asystent głosowy do sterowania urządzeniami 
            </h1>
            <p className="text-xl text-gray-600">
            </p>
          </div>
          <VapiAssistant 
            publicApiKey={VAPI_PUBLIC_API_KEY}
            assistantId={ASSISTANT_ID}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}