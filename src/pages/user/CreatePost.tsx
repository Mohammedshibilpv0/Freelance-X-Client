import React, { useState, useEffect } from "react";
import ImageForm from "../../components/user/CreatePost/ImageForm";
import PostForm from "../../components/user/CreatePost/PostForm";
import StepperComponent from "../../components/user/stepper/Stepper";
import Publish from "../../components/user/CreatePost/Publish";
import { fetchSubcategories , fetchCategory} from "../../api/user/userServices";

export interface FormData {
  projectName: string;
  description: string;
  skills: string[];
  startBudget: string;
  endBudget: string;
  deadline: string;
  keyPoints: string[];
  images: string[];
  searchKey: string[];
  category: string;
  subcategory: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Subcategory {
  _id: string;
  name: string;
}

const CreatePost: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    description: '',
    skills: [],
    startBudget: '',
    endBudget: '',
    deadline: '',
    searchKey: [],
    keyPoints: [''],
    images: [''],
    category: '',
    subcategory: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetchCategory();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryChange = async (categoryId: string) => {
    setFormData({ ...formData, category: categoryId });
    if (categoryId) {
      try {
        const response = await fetchSubcategories(categoryId);
        setSubcategories(response.subcategories || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData({
      ...formData,
      ...newData
    });
  };

  const steps = [
    { title: 'Overview Info' },
    { title: 'More Details' },
    { title: 'Publish' }
  ];

  return (
    <div>
      <StepperComponent currentStep={step} stepTitles={steps} />
      {step === 0 && (
        <PostForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onNext={handleNext}
        />
      )}
      {step === 1 && (
        <ImageForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onPrev={handlePrev}
          onNext={handleNext}
          categories={categories}
          subcategories={subcategories}
          onCategoryChange={handleCategoryChange}
        />
      )}
      {step === 2 && (
        <Publish
          type="post"
          data={formData}
          categories={categories}
          subcategories={subcategories}
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default CreatePost;
