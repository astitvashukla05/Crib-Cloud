import { Bath, Bed, Heart, House, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const CardCompact = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardCompactProps) => {
  const defaultSrc = '/placeholder.jpg';
  const initialSrc = property.photoUrls?.[0] || defaultSrc;
  const [imgSrc, setImgSrc] = useState(initialSrc);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full flex h-44 mb-5 border border-gray-200">
      {/* image */}
      <div className="relative w-1/3 h-full">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          unoptimized
          className="object-cover"
          onError={() => setImgSrc(defaultSrc)}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {property.isPetsAllowed && (
            <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-semibold px-2 py-1 rounded-full w-fit shadow">
              Pets
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="bg-white/90 backdrop-blur-sm text-black text-xs font-semibold px-2 py-1 rounded-full w-fit shadow">
              Parking
            </span>
          )}
        </div>
      </div>

      {/* content */}
      <div className="w-2/3 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold hover:text-blue-600 transition leading-tight">
              {propertyLink ? (
                <Link href={propertyLink} scroll={false}>
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h2>

            {showFavoriteButton && (
              <button
                className="bg-white shadow p-1 rounded-full hover:bg-gray-50 transition"
                onClick={onFavoriteToggle}
                aria-label="toggle favorite"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            )}
          </div>

          <p className="text-gray-600 mb-1 text-sm">
            {property.location?.address}, {property.location?.city}
          </p>

          <div className="flex text-sm items-center">
            <Star className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 ml-1">
              ({property.numberOfReviews})
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-2 text-gray-600">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {property.beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> {property.baths}
            </span>
            <span className="flex items-center gap-1">
              <House className="w-4 h-4" /> {property.squareFeet}
            </span>
          </div>

          <p className="text-base font-bold">
            ${property.pricePerMonth.toFixed(0)}
            <span className="text-gray-600 text-xs font-normal"> /mo</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardCompact;
