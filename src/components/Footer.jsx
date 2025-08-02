import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">MatrimonyHub</h2>
          <p className="text-sm">
            Find your perfect match with us. We connect hearts with trust, care, and compatibility.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebook className="hover:text-white text-xl" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter className="hover:text-white text-xl" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <FaInstagram className="hover:text-white text-xl" />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'text-white font-medium' : 'hover:text-white text-gray-300'
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? 'text-white font-medium' : 'hover:text-white text-gray-300'
                }
              >
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'text-white font-medium' : 'hover:text-white text-gray-300'
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? 'text-white font-medium' : 'hover:text-white text-gray-300'
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <NavLink
                to="/privacy"
                className={({ isActive }) =>
                  isActive ? 'text-white font-medium' : 'hover:text-white text-gray-300'
                }
              >
                Privacy Policy
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/terms"
                className={({ isActive }) =>
                  isActive ? 'text-white font-medium' : 'hover:text-white text-gray-300'
                }
              >
                Terms & Conditions
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Contact Us</h3>
          <p className="flex items-center gap-2">
            <FaPhone className="text-lg" /> +880 1234-567890
          </p>
          <p className="flex items-center gap-2 mt-2">
            <FaEnvelope className="text-lg" /> support@matrimonyhub.com
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} MatrimonyHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
