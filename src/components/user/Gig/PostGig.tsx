import React, { useEffect, useState } from 'react';
import { fetchSubcategories,fetchCategory } from "../../../api/user/userServices";

interface Category {
    _id: string;
    name: string;
}

interface Subcategory {
    id: string;
    name: string;
}

interface PostGigProps {
    formValues: {
        projectName: string;
        description: string;
        category: string;
        subcategory: string;
        searchTags: string[];
    };
    onFormChange: (name: string, value: any) => void;
    onNext: () => void;
}

const PostGig: React.FC<PostGigProps> = ({ formValues, onFormChange, onNext }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [currentTag, setCurrentTag] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetchCategory();
                setCategories(response.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        }
        fetchCategories();
    }, []);



    const handleCategoryChange = async (categoryId: string) => {
        const selectedCategory = categories.find(cat => cat._id === categoryId);
        const categoryName = selectedCategory ? selectedCategory.name : "";
    
   
        onFormChange('category', categoryName);
        if (categoryId) {
            try {
                const response = await fetchSubcategories(categoryId);
                setSubcategories(response.subcategories || []);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                setSubcategories([]);
            }
        } else {
            setSubcategories([]);
        }
    };
    
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFormChange(name, value);
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTag(e.target.value);
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim() !== '') {
            e.preventDefault();
            onFormChange('searchTags', [...formValues.searchTags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        const updatedTags = formValues.searchTags.filter((_, index) => index !== indexToRemove);
        onFormChange('searchTags', updatedTags);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (formValues.projectName.length < 3) {
            newErrors.projectName = "Project name must be at least 3 characters long.";
        }
        if (formValues.description.length < 10) {
            newErrors.description = "Description must be at least 10 characters long.";
        }
        if (formValues.searchTags.length < 2) {
            newErrors.searchTags = "At least 2 tags are required.";
        }
        if (!formValues.category) {
            newErrors.category = "Category is required.";
        }
        if (!formValues.subcategory) {
            newErrors.subcategory = "Subcategory is required.";
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
        <div className="bg-slate-50 flex justify-center items-center">
            <form className="grid grid-cols-2 gap-6 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mt-10">
                
                <div className="col-span-2 sm:col-span-1">
                    <label className="block mb-2 text-lg font-semibold text-gray-800">Work title</label>
                    <textarea
                        name="projectName"
                        value={formValues.projectName}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={80}
                        placeholder="Enter your project title"
                    />
                    <span className="text-sm text-gray-500">{formValues.projectName.length}/80 max</span>
                    {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                    <label className="block mb-2 text-lg font-semibold text-gray-800">Description</label>
                    <textarea
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        minLength={10}
                        placeholder="Enter your project description"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
    <label className="block mb-2 text-lg font-semibold text-gray-800">Category</label>
    <select
        name="category"
        value={formValues.category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        required
        className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="">Select a category</option>
        {categories.map((category) => (
            <option key={category._id} value={category._id}>
                {category.name}
            </option>
        ))}
    </select>
    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
</div>

                
                <div className="col-span-2 sm:col-span-1">
                    <label className="block mb-2 text-lg font-semibold text-gray-800">Subcategory</label>
                    <select
                        name="subcategory"
                        value={formValues.subcategory}
                        onChange={handleChange}
                        required
                        className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select a subcategory</option>
                        {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                    {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                    <label className="block mb-2 text-lg font-semibold text-gray-800">Search tags</label>
                    <input
                        type="text"
                        name="currentTag"
                        value={currentTag}
                        onChange={handleTagInputChange}
                        onKeyDown={handleTagInputKeyDown}
                        placeholder="Enter a tag and press Enter"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-500">Press enter to add new tag | {formValues.searchTags.length}/5 tags maximum.</span>
                    {errors.searchTags && <p className="text-red-500 text-sm mt-1">{errors.searchTags}</p>}
                    <div className="mt-2">
                        {formValues.searchTags.map((tag, index) => (
                            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded mb-1">
                                {tag}
                                <button
                                    type="button"
                                    className="ml-1 text-red-500"
                                    onClick={() => removeTag(index)}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="col-span-2 text-right mt-4">
                    <button
                        type="button"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostGig;
