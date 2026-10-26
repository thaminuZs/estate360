import { Trees } from 'lucide-react';
import { Link } from '../../router';

export function Footer() {
  return (
    <footer className="bg-[#1F3D2C] text-[#D7E6DD] border-t border-[#162D20] py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#D7E6DD] flex items-center justify-center text-[#1F3D2C]">
            <Trees className="w-3.5 h-3.5 text-[#1F3D2C]" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">
            Estate 360
          </span>
          <span className="text-[#D7E6DD]/60">|</span>
          <span className="text-[#D7E6DD]/80">Plantation Management</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[#D7E6DD]/80">
          <Link to="/" className="hover:text-white transition-colors cursor-pointer">
            Overview
          </Link>
          <Link to="/login" className="hover:text-white transition-colors cursor-pointer">
            Owner Login
          </Link>
          <Link to="/register" className="hover:text-white transition-colors cursor-pointer">
            Owner Registration
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-[#D7E6DD]/60">
          © {new Date().getFullYear()} Estate 360. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
