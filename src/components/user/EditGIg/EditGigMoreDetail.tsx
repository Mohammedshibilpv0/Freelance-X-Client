import React, { useState, useEffect } from 'react';
import ImageUploader from '../imageuploader/UploadImage';

interface DetailsI {
  price: string | undefined | number;
  deadline: string | undefined;
}

interface MoreDetailsProps {
  images: string[];
  onImageChange: (index: number, imageUrl: string) => void;
  onRemoveImage: (index: number) => void;
  onPrev: () => void;
  onNext: (deadline: string, price: number) => void;
  Details: DetailsI;
}

const EditGigMoreDetail: React.FC<MoreDetailsProps> = ({
  images,
  onImageChange,
  onRemoveImage,
  onNext,
  onPrev,
  Details,
}) => {
  const [deadline, setDeadline] = useState<string>(Details.deadline || '');
  const [price, setPrice] = useState<number | ''>(Details.price ? Number(Details.price) : '');
  const [error, setError] = useState('');

  useEffect(() => {
    setDeadline(Details.deadline || '');
    setPrice(Details.price ? Number(Details.price) : '');
  }, [Details]);

  const handleNext = () => {
    if (!deadline || !price) {
      setError("Please set both a valid deadline and price.");
    } else if (price < 100) {
      setError("Price must be greater than 100.");
    }  else if(images.length==0){
      setError("Image required.");
      
    } else {
      setError('');
      onNext(deadline, Number(price));
    }
  };

  return (
    <div className="w-full mt-8 max-w-2xl mx-auto p-6 bg-slate-50 shadow-md rounded-lg py-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Upload Images</h2>
        <p className="text-gray-500">You can upload up to three images for your project.</p>
      </div>

      <ImageUploader images={images} onImagesChange={onImageChange} onRemoveImage={onRemoveImage} />

      <div className="mt-6">
        <label className="block text-gray-700">Deadline</label>
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full mt-2 p-2 border rounded-md"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <div className="mt-6">
        <label className="block text-gray-700">Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full mt-2 p-2 border rounded-md"
        />
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={onPrev} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md">
          Previous
        </button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Next
        </button>
      </div>
    </div>
  );
};

export default EditGigMoreDetail;
