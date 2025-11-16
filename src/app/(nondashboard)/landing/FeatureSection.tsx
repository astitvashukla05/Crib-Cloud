'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeatureSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto">
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-12 w-full sm:w-2/3 mx-auto"
        >
          Quickly find a home you want with our effective search filters
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeaturesCard
                imageSrc={`/landing-search${3 - index}.png`}
                title={
                  [
                    'Trustworthy & verified listings',
                    'Browse rental listings with ease',
                    'Simplify your rental search with advanced features',
                  ][index]
                }
                description={
                  [
                    'Discover the best rental options with user ratings and reviews.',
                    'Easily browse listings with clear pricing and photos.',
                    'Find trustworthy and verified rentals for a hassle-free experience.',
                  ][index]
                }
                linkText={['Explore', 'Search', 'Discover'][index]}
                linkHref={['/explore', '/search', '/discover'][index]}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const FeaturesCard: React.FC<{
  imageSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}> = ({ imageSrc, title, description, linkText, linkHref }) => {
  return (
    <article className="flex flex-col text-center items-center h-full">
      <div className="p-4 rounded-lg mb-4 flex items-center justify-center h-40 sm:h-48">
        <Image
          src={imageSrc}
          width={400}
          height={400}
          className="w-full h-full object-contain"
          alt={title}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-4 text-gray-600">{description}</p>
      </div>

      <Link
        href={linkHref}
        className="inline-block rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400 transition mt-auto"
        scroll={false}
      >
        {linkText}
      </Link>
    </article>
  );
};

export default FeatureSection;
