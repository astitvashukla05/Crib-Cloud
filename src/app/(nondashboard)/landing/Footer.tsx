import Link from 'next/link';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const FooterSection = () => {
  return (
    <footer className="border-t border-gray-200 py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start text-center md:text-left">
          <div className="mb-8 md:mb-0">
            <Link
              href="/"
              scroll={false}
              className="text-2xl font-extrabold tracking-tight hover:text-primary-600 transition"
            >
              CRIBCLOUD
            </Link>
            <p className="mt-2 text-gray-500 text-sm">
              Your trusted partner for verified rentals.
            </p>
          </div>

          <nav className="mb-8 md:mb-0">
            <ul className="flex flex-col md:flex-row md:space-x-6 space-y-3 md:space-y-0 text-gray-600">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary-600 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary-600 transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-600 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary-600 transition"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary-600 transition"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex justify-center md:justify-end space-x-5 text-gray-600">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-primary-600 transition"
            >
              <FontAwesomeIcon icon={faFacebook} className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-primary-600 transition"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-primary-600 transition"
            >
              <FontAwesomeIcon icon={faTwitter} className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-primary-600 transition"
            >
              <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-primary-600 transition"
            >
              <FontAwesomeIcon icon={faYoutube} className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="flex flex-wrap justify-center gap-4">
            <span>
              © {new Date().getFullYear()} CribCloud. All rights reserved.
            </span>
            <Link href="/privacy" className="hover:text-primary-600 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-600 transition">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-primary-600 transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
