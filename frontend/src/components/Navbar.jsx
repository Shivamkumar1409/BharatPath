import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/disease', label: 'Crop Disease', icon: '🌿' },
    { path: '/mandi', label: 'Mandi Prices', icon: '📊' },
    { path: '/profit', label: 'Profit Tracker', icon: '💰' },
    { path: '/schemes', label: 'Gov. Schemes', icon: '🏛️' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-green-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌾</span>
            <div>
              <span className="text-white font-bold text-xl">Bharat</span>
              <span className="text-yellow-300 font-bold text-xl">Path</span>
              <p className="text-green-200 text-xs leading-none">
                किसान का साथी
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-yellow-400 text-green-900 shadow-md'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Login/Register buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/login"
              className="px-4 py-2 text-green-100 hover:text-white text-sm font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 rounded-lg text-sm font-bold transition shadow-md"
            >
              Register
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-yellow-400 text-green-900'
                    : 'text-green-100 hover:bg-green-600'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="flex space-x-2 px-4 pt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 border border-green-300 text-green-100 rounded-lg text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 bg-yellow-400 text-green-900 rounded-lg text-sm font-bold"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}