import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className='bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Language Proficiency Notice */}
        <div className='mb-12 p-6 bg-white rounded-lg shadow-sm'>
          <p className='text-gray-700 text-sm leading-relaxed'>
            For non-native English speakers, a minimum English proficiency of C1 (Common European Framework of Reference for Languages - CEFR) is recommended to comfortably enjoy and participate in the course. You can check your proficiency with this{' '}
            <Link 
              href="https://www.efset.org/quick-check/" 
              target="_blank" 
              className='text-gray-900 underline hover:text-gray-600'
            >
              quick online test: EF SET English Test
            </Link>
            {' '}unless you have TOEFL scores of 23–30 (Reading), 22–30 (Listening), and 24–30 (Speaking).
          </p>
        </div>

        <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
          <div>
            <p className='font-bold text-gray-900 text-lg'>
              Context. Clarity. Connection.
            </p>
          </div>
          
          <p className='text-center text-gray-500'>
            © 2025 HBH. All rights reserved. - Made with <Heart className="inline-block h-4 w-4 text-red-500" /> by HB
          </p>
        </div>
      </div>
    </footer>
  )
}
