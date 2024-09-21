import React, { useEffect, useState } from 'react';
import StepperComponent from "../../components/user/stepper/Stepper";
import EditGigForm from '../../components/user/EditGIg/EditGig'; 
import { useParams } from 'react-router-dom';
import { getFreelancerWorkById } from '../../api/user/userServices';
import EditGigMoreDetail from '../../components/user/EditGIg/EditGigMoreDetail';
import PublishEdit from '../../components/user/EditGIg/PublishEdit';

export interface FormValues {
    projectName: string;
    description: string;
    category: string;
    subcategory: string;
    deadline: string;
    searchTags: string[];
    images: string[];
    price: number | string;
}

const EditGig: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [formValues, setFormValues] = useState<FormValues>({
        projectName: '',
        description: '',
        category: '',
        subcategory: '',
        searchTags: [],
        images: [],
        deadline: '',
        price: ''
    });

    const [step, setStep] = useState(0);

    useEffect(() => {
        const fetchGigData = async () => {
            try {
                const response = await getFreelancerWorkById(id, undefined);
                setFormValues(response.data);
            } catch (error) {
                console.error("Error fetching gig data:", error);
            }
        };

        fetchGigData();
    }, [id]); 

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

    const details={
        price: formValues.price,
        deadline: formValues.deadline
     }

    return (
        <>
            <StepperComponent currentStep={step} stepTitles={steps} />
            {step === 0 && (
                <EditGigForm 
                    formValues={formValues} 
                    onFormChange={handleFormChange} 
                    onNext={handleNext} 
                />
            )}

            {step === 1 && (
                <EditGigMoreDetail
                    Details={details}
                    images={formValues.images}
                    onImageChange={handleImageChange}
                    onRemoveImage={handleRemoveImage}
                    onNext={handleNextWithDetails}
                    onPrev={handlePrev}
                />
            )}

            {step === 2 && (
                <PublishEdit
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

export default EditGig;
