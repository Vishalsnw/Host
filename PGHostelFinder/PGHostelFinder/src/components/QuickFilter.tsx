'use client';

import Link from 'next/link';
import { 
  Users, 
  Utensils, 
  GraduationCap, 
  Building, 
  Building2,
  IndianRupee,
  Home
} from 'lucide-react';

const quickFilters = [
  {
    icon: Users,
    label: "Girls PG",
    href: "/search?gender=girls",
    color: "bg-pink-50 text-pink-600 border-pink-200"
  },
  {
    icon: Users,
    label: "Boys PG", 
    href: "/search?gender=boys",
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  {
    icon: Utensils,
    label: "With Food",
    href: "/search?food=true",
    color: "bg-green-50 text-green-600 border-green-200"
  },
  {
    icon: Building,
    label: "Hostels",
    href: "/search?type=hostel",
    color: "bg-purple-50 text-purple-600 border-purple-200"
  },
  {
    icon: Home,
    label: "Flats",
    href: "/search?type=flat",
    color: "bg-orange-50 text-orange-600 border-orange-200"
  },
  {
    icon: IndianRupee,
    label: "Under ₹8K",
    href: "/search?maxRent=8000",
    color: "bg-amber-50 text-amber-600 border-amber-200"
  },
  {
    icon: GraduationCap,
    label: "Near College",
    href: "/search",
    color: "bg-cyan-50 text-cyan-600 border-cyan-200"
  }
];

export default function QuickFilters() {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2">
        {quickFilters.map((filter, index) => (
          <Link
            key={index}
            href={filter.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all hover:shadow-md ${filter.color}`}
          >
            <filter.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{filter.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
