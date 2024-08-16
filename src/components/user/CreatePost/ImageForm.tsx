import React, { useState } from "react";
import { FormData as formDatatype, Category, Subcategory } from "../../../pages/user/CreatePost";
import ImageUploader from "../imageuploader/UploadImage";

interface ImageFormProps {
  formData: formDatatype;
  onFormDataChange: (data: Partial<formDatatype>) => void;
  onPrev: () => void;
  onNext: () => void;
  categories: Category[];
  subcategories: Subcategory[];
  onCategoryChange: (categoryId: string) => void;
}

const ImageForm: React.FC<ImageFormProps> = ({
  formData,
  onFormDataChange,
  onPrev,
  onNext,
  categories,
  subcategories,
  onCategoryChange,
}) => {
  const [newKeyTerm, setNewKeyTerm] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = (index: number, imageUrl: string) => {
    const newImages: string[] = [...formData.images];
    newImages[index] = imageUrl; // imageUrl should always be a string
    onFormDataChange({ images: newImages });
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages: string[] = [...formData.images];
    newImages[index] = ""; // Set to an empty string instead of null
    onFormDataChange({ images: newImages });
  };
  

  const handleKeyTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKeyTerm(e.target.value);
  };

  const handleKeyTermKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newKeyTerm.trim()) {
      e.preventDefault();
      const updatedKeyTerms = [...formData.searchKey, newKeyTerm.trim()];
      onFormDataChange({ searchKey: updatedKeyTerms });
      setNewKeyTerm("");
    }
  };

  const handleRemoveKeyTerm = (index: number) => {
    const updatedKeyTerms = formData.searchKey.filter((_, i) => i !== index);
    onFormDataChange({ searchKey: updatedKeyTerms });
  };

  const validateForm = (): boolean => {
    const { images, category, subcategory, searchKey } = formData;
    const newErrors: { [key: string]: string } = {};

    if (!images.some(img => img !== null && img !== "")) {
      newErrors.images = "At least one image is required.";
    }

    if (!category) {
      newErrors.category = "Category is required.";
    }
    if (!subcategory) {
      newErrors.subcategory = "Subcategory is required.";
    }

    if (searchKey.length === 0) {
      newErrors.searchKey = "At least one key term is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="w-full mt-8 max-w-2xl mx-auto p-6 bg-slate-50 shadow-md rounded-lg py-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Upload Images</h2>
        <p className="text-gray-500">You can upload up to three images for your project.</p>
      </div>

      <ImageUploader
        images={formData.images}
        onImagesChange={handleImageChange}
        onRemoveImage={handleRemoveImage}
      />
      {errors.images && <p className="text-red-500 mt-2">{errors.images}</p>}

      <div className="flex space-x-4 mb-8 mt-6">
        <div className="w-1/2">
          <select
            value={formData.category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border border-slate-200 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.length ? (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
          </select>
          {errors.category && <p className="text-red-500 mt-2">{errors.category}</p>}
        </div>

        <div className="w-1/2">
          <select
            value={formData.subcategory}
            onChange={(e) => onFormDataChange({ subcategory: e.target.value })}
            className="w-full p-2 border border-slate-200 rounded-md"
            disabled={!formData.category}
          >
            <option value="">Select Subcategory</option>
            {subcategories.length ? (
              subcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))
            ) : (
              <option value="">No subcategories available</option>
            )}
          </select>
          {errors.subcategory && <p className="text-red-500 mt-2">{errors.subcategory}</p>}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold">Key Terms</h3>
        <input
          type="text"
          value={newKeyTerm}
          onChange={handleKeyTermChange}
          onKeyDown={handleKeyTermKeyDown}
          placeholder="Add a key term and press Enter"
          className="w-full p-2 border border-slate-200 rounded-md"
        />
        <div className="mt-4">
          {formData.searchKey.length ? (
            formData.searchKey.map((term, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-sm rounded-full px-3 py-1 mr-2 mb-2"
              >
                {term}
                <button
                  className="ml-2 text-red-600"
                  onClick={() => handleRemoveKeyTerm(index)}
                >
                  x
                </button>
              </span>
            ))
          ) : (
            <p className="text-gray-500">No key terms added</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onPrev}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageForm;
