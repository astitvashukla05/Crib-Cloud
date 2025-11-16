'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection: React.FC = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 mb-16 bg-white"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            Discover
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Find your dream rental property today
          </p>
          <p className="mt-2 text-gray-500 max-w-3xl mx-auto">
            Searching for your dream rental property has never been easier. With
            our user-friendly search feature, you can quickly find the perfect
            home that meets all your needs. Start your search today and discover
            your dream rental property!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center items-stretch">
          {[
            {
              imageSrc: '/landing-icon-wand.png',
              title: 'Search for Properties',
              description:
                'Browse through our extensive collection of rental properties in your desired location.',
            },
            {
              imageSrc: '/landing-icon-calendar.png',
              title: 'Book Your Rental',
              description:
                "Once you've found the perfect rental property, easily book it online with just a few clicks.",
            },
            {
              imageSrc: '/landing-icon-heart.png',
              title: 'Enjoy Your New Home',
              description:
                'Move into your new rental property and start enjoying your dream home.',
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const DiscoverCard: React.FC<{
  imageSrc: string;
  title: string;
  description: string;
}> = ({ imageSrc, title, description }) => {
  return (
    <article className="flex flex-col h-full bg-primary-50 rounded-lg shadow-lg px-6 py-10">
      {/* icon */}
      <div className="flex-shrink-0 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-700 p-3 w-12 h-12">
        <Image
          src={imageSrc}
          alt={title}
          width={20}
          height={20}
          className="object-contain"
        />
      </div>

      {/* content grows */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-medium text-gray-800">{title}</h3>
        <p className="mt-3 text-base text-gray-500">{description}</p>
      </div>

      {/* pinned at bottom so all buttons align if you add them */}
      <div className="mt-6">
        <Link
          href="#"
          className="inline-block rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
        >
          Learn more
        </Link>
      </div>
    </article>
  );
};

export default DiscoverSection;
