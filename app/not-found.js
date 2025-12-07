'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Page not found</p>
        <Link 
          href="/" 
          className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
