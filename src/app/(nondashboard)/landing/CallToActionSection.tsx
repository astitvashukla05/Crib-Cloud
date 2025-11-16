'use client';

import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CallToActionSection: React.FC = () => {
  const onSearchClick = () => {
    const el = document.querySelector('#search');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative py-20">
      <Image
        src="/landing-call-to-action.jpg"
        alt="People searching for rental homes"
        fill
        priority
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-20 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="bg-black/0 rounded-xl px-6 py-10 md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0 md:flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Find your dream rental property
            </h2>
            <p className="mt-2 text-white/90 max-w-2xl">
              Discover a wide range of rental properties in your desired
              location — verified, affordable, and student-friendly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <motion.button
              onClick={onSearchClick}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Go to search"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Search
            </motion.button>

            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md bg-secondary-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-white/30"
                scroll={false}
                aria-label="Sign up"
              >
                Sign up
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;
