'use client'
import Image from "next/image"
export function SimpleFooter() {
  return (
    <footer className="bg-black text-white py-8 px-4 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
          <Image
              src="/images/logo/eurlquidLogo.png"
              alt="eurlquid logo"
              width={32}
              height={32}
              className="rounded-full border border-gray-600 mx-3"
              priority
            />
            <span className="text-xl font-bold">eurlquid</span>
            <span className="ml-2 text-gray-400 text-sm">© 2024</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}