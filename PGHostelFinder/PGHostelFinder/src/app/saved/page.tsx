'use client';

import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Heart, Search } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="w-7 h-7 text-red-500" />
          Saved PGs
        </h1>
        <p className="text-gray-500 mt-1">Your favorite accommodations</p>
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-gray-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No saved listings yet</h2>
        <p className="text-gray-500 mb-6 max-w-xs">
          Start exploring and save your favorite PGs to compare them later
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          <Search className="w-5 h-5" />
          Explore PGs
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
