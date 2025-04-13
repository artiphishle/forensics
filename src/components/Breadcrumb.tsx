'use client';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  const parts = path.split('/') || [''];

  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Link
        href="#"
        onClick={() => onNavigate('')}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4 mr-1" />
      </Link>

      {parts.map((part, index) => {
        const currentPath = parts.length ? parts.slice(0, index + 1).join('.') : '';
        console.log('current', currentPath);
        return (
          <div key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link
              href="#"
              onClick={() => onNavigate(currentPath)}
              className="ml-1 text-gray-600 hover:text-gray-900"
            >
              {part}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

interface BreadcrumbProps {
  readonly path: string;
  readonly onNavigate: (path: string) => void;
}
