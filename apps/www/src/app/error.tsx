'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="text-blue-500 hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );
}