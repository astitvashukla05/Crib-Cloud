import { Bath, Bed, Heart, House, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardProps) => {
  const defaultSrc = '/placeholder.jpg';
  const initial = property.photoUrls?.[0] || defaultSrc;
  const [imgSrc, setImgSrc] = useState(initial);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full mb-6 border border-gray-200">
      <div className="relative">
        <div className="w-full h-52 relative">
          <Image
            src={imgSrc}
            alt={property.name}
            fill
            unoptimized
            className="object-cover"
            sizes="100vw"
            onError={() => setImgSrc(defaultSrc)}
          />
        </div>

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {property.isPetsAllowed && (
            <span className="px-3 py-1 text-xs bg-white/90 backdrop-blur-sm shadow rounded-full font-semibold text-gray-800">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="px-3 py-1 text-xs bg-white/90 backdrop-blur-sm shadow rounded-full font-semibold text-gray-800">
              Parking
            </span>
          )}
        </div>

        {/* favorite button */}
        {showFavoriteButton && (
          <button
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-full shadow cursor-pointer transition"
            onClick={onFavoriteToggle}
            aria-label="toggle favorite"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`}
            />
          </button>
        )}
      </div>

      {/* content */}
      <div className="p-5 space-y-2">
        <h2 className="text-lg font-bold leading-tight hover:text-blue-600 transition">
          {propertyLink ? (
            <Link href={propertyLink} scroll={false}>
              {property.name}
            </Link>
          ) : (
            property.name
          )}
        </h2>

        <p className="text-gray-600 text-sm">
          {property.location?.address}, {property.location?.city}
        </p>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center text-sm">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 ml-1">
              ({property.numberOfReviews})
            </span>
          </div>

          <p className="text-lg font-bold">
            ${property.pricePerMonth.toFixed(0)}
            <span className="text-gray-500 text-sm font-normal"> /mo</span>
          </p>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between items-center gap-4 text-gray-600 pt-2 text-sm">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {property.beds} Bed
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {property.baths} Bath
          </span>
          <span className="flex items-center gap-1">
            <House className="w-4 h-4" /> {property.squareFeet} ft²
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
