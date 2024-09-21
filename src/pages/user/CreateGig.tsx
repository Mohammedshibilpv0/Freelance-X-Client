import React, { useState } from 'react';
import PostGig from "../../components/user/Gig/PostGig";
import StepperComponent from "../../components/user/stepper/Stepper";
import MoreDetails from '../../components/user/Gig/moreDetails';
import Publish from '../../components/user/CreatePost/Publish';

export interface FormValues {
    _id?:string
    projectName: string;
    description: string;
    category: string;
    subcategory: string;
    deadline:string
    searchTags: string[];
    images:string[]
    price:number|string
}

const CreateGig: React.FC = () => {
    const [step, setStep] = useState(0);
    const [formValues, setFormValues] = useState<FormValues>({
        projectName: '',
        description: '',
        category: '',
        subcategory: '',
        searchTags: [],
        images:[],
        deadline:'',
        price:''
    });

    const steps = [
        { title: 'Overview Info' },
        { title: 'More Details' },
        { title: 'Publish' }
    ];

    const handlePrev = () => {
        setStep(step - 1);
      };
    
      const handleNext = () => {
        setStep(step + 1);
      };

    const handleFormChange = (name: string, value: string) => {
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    console.log(formValues);
    

    const handleNextWithDetails = (deadline: string, price: number) => {
      setFormValues({
        ...formValues,
        deadline: deadline,
        price: price
      });
      handleNext();
    };

  const handleImageChange = (index: number, imageUrl: string) => {
    const newImages = [...formValues.images];
    newImages[index] = imageUrl;
    setFormValues({ ...formValues, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formValues.images];
    newImages[index] = '';
    setFormValues({ ...formValues, images: newImages });
  };

    return (
        <>
            <StepperComponent currentStep={0} stepTitles={steps} />
            {step === 0 && (
                 <PostGig formValues={formValues} onFormChange={handleFormChange} onNext={handleNext} />
             )}

            {step === 1&& (
              <MoreDetails
              images={formValues.images}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              onNext={handleNextWithDetails}
              onPrev={handlePrev}
            />
             )}

            {step === 2&& (
              <Publish
              data={formValues}
              type='gig'
              categories={formValues.category}
              subcategories={formValues.subcategory}
              onPrev={handlePrev}
              
            />
             )}
           
        </>
    );
}

export default CreateGig;
