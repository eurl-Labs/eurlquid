'use client';

import Link from 'next/link';

export default function TestGroqLink() {
  return (
    <Link href="/test-groq" className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg hover:bg-blue-700 z-50">
      Test Groq API
    </Link>
  );
}
