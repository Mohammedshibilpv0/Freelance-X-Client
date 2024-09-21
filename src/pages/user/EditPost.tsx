import React, { useState, useEffect } from "react";
import StepperComponent from "../../components/user/stepper/Stepper";
import { fetchSubcategories , fetchCategory, getClientPostById} from "../../api/user/userServices";
import { useParams } from "react-router-dom";
import EditPostForm from "../../components/user/editPost/EditPostForm";
import EditPostImageForm from "../../components/user/editPost/editPostImageForm";
import PublishEdit from "../../components/user/EditGIg/PublishEdit";

export interface FormData {
  _id?:string
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

const EditPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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

  useEffect(() => {
    const fetchGigData = async () => {
        try {
            const response = await getClientPostById(id, undefined);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching gig data:", error);
        }
    };

    fetchGigData();
}, [id]); 
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
        <EditPostForm
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onNext={handleNext}
        />
      )}
      {step === 1 && (
        <EditPostImageForm
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
        <PublishEdit
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

export default EditPost;
