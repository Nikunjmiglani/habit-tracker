'use client';

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard'); // redirect if already logged in
    }
  }, [status, router]);

  // Optional: handle loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-900">Sign In</h1>
        <p className="text-center text-sm text-gray-500 mt-2 mb-8">
          Start tracking your habits with Habitr
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-md shadow-sm hover:shadow-md transition duration-150 bg-white text-gray-700 font-medium"
        >
          <FcGoogle size={22} />
          Sign in with Google
        </button>

        <p className="mt-6 text-xs text-center text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}



