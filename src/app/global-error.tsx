'use client'

import Link from 'next/link'
import { ArrowButton } from '@/components/atoms/button'

export default function GlobalError({
  error: _error, // eslint-disable-line @typescript-eslint/no-unused-vars
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="mb-8">
              <h1 className="text-6xl font-bold text-red-500 mb-4">Error</h1>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Dogodila se greška
              </h2>
              <p className="text-gray-600 mb-8">
                Nešto je pošlo po zlu. Molimo pokušajte kasnije.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full"
              >
                <ArrowButton size="lg" className="w-full">
                  Pokušaj ponovno
                </ArrowButton>
              </button>
              
              <Link href="/hr">
                <ArrowButton variant="ghost" size="lg" className="w-full">
                  Povratak na početnu
                </ArrowButton>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}