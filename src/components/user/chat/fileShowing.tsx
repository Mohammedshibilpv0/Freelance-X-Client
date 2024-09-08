import React, { useState } from 'react';
import { FaSpinner } from 'react-icons/fa'; 

const SkeletonLoader = () => (
  <div className="relative bg-gray-300 animate-pulse w-full  rounded-lg flex items-center justify-center">
    <FaSpinner className="animate-spin text-gray-500" size={24} />
  </div>
);

const ImageWithSkeleton = ({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <div className="relative">
      {!isImageLoaded && <SkeletonLoader />}

      {/* Image */}
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClick}
        onLoad={handleImageLoad}
        onError={() => setIsImageLoaded(true)}
      />
    </div>
  );
};

export default ImageWithSkeleton;
