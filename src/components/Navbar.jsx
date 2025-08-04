import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, role, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Biodatas', path: '/biodatas' },
  ];

  // 🧠 Adjust dashboard path based on role
  let dashboardPath = '/dashboard';
  if (role === 'admin') dashboardPath = '/dashboard/admin';
  else if (role === 'user') dashboardPath = '/dashboard/user';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const linkStyle = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
      : 'text-gray-600 hover:text-blue-600 transition';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MyBrand
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map(link => (
              <NavLink key={link.name} to={link.path} className={linkStyle}>
                {link.name}
              </NavLink>
            ))}

            {user && (
              <NavLink to={dashboardPath} className={linkStyle}>
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Right Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              className={linkStyle}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          {user && (
            <NavLink
              to={dashboardPath}
              className={linkStyle}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </NavLink>
          )}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600 transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded mt-2 text-center hover:bg-blue-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;