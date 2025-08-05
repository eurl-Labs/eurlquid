"use client";
import Image from "next/image";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-4">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center">
            <Image
              src="/images/logo/eurlquidLogo.png"
              alt="eurlquid logo"
              width={40}
              height={70}
              className="rounded-full"
            />
          <span className="text-2xl font-bold ml-2">eurlquid</span>
        </div>

        <ul className="hidden sm:flex space-x-6">
          <li>
            <a href="#" className="hover:text-gray-300">
              Docs
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              API
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-300">
              Github
            </a>
          </li>
        </ul>
        
        {/* Mobile menu button */}
        <button className="sm:hidden flex flex-col space-y-1">
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>
      </nav>
    </header>
  );
}
