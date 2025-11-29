'use client';

import { Home, Search, BarChart3, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-primary-600 text-white safe-area-top">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-600" />
          </div>
          <span className="font-bold text-lg">PG Finder</span>
        </Link>
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-primary-500 rounded-lg transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className={cn(
        "overflow-hidden transition-all duration-300 bg-primary-700",
        isMenuOpen ? "max-h-48" : "max-h-0"
      )}>
        <nav className="px-4 py-2 space-y-1">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link 
            href="/search" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Search className="w-5 h-5" />
            <span>Search PGs</span>
          </Link>
          <Link 
            href="/compare" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Rent Comparison</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
