import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { setModuleClientPost,setModuleFreelancerPost } from '../../api/user/userServices';
import { IProject } from '../user/DetailProject/ProjectDetailsPage';


Modal.setAppElement('#root');

interface Prop{
    projectId:string
    isUserPost:boolean
   setProjectData: React.Dispatch<React.SetStateAction<IProject|null>>;
   amount:string
}

const PaymentForm:React.FC<Prop> = ({projectId,isUserPost,setProjectData,amount}) => {
    const amountTotal=Number(amount)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState<number>(amountTotal);
    const [numModules, setNumModules] = useState<number>(1);
    const [modules, setModules] = useState<{ heading: string; date: string; amount: number }[]>([]);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    

    const maxModules = 4;

    useEffect(() => {
        if (numModules > 0) {
            calculateModulePayments(numModules);
        }
    }, [numModules, totalAmount]);  

    const calculateModulePayments = (modulesCount: number) => {
        const paymentPerModule = totalAmount / modulesCount;
        const updatedModules = modules.slice(0, modulesCount).map((module) => ({
            ...module,
            amount: paymentPerModule
        }));
        
        if (modulesCount > modules.length) {
            const newModules = Array.from({ length: modulesCount - modules.length }, (_, index) => ({
                heading: `Module ${modules.length + index + 1}`,
                date: '',
                amount: paymentPerModule
            }));
            setModules([...updatedModules, ...newModules]);
        } else {
            setModules(updatedModules);
        }
    };

    const handleNumModulesChange = (delta: number) => {
       
        const newValue = Math.min(maxModules, Math.max(1, numModules + delta));
        setNumModules(newValue);
    };

    const handleModuleChange = (index: number, field: string, value: string) => {
        const updatedModules = [...modules];
        if (field === 'amount') {
            updatedModules[index] = { ...updatedModules[index], [field]: parseFloat(value) };
        } else {
            updatedModules[index] = { ...updatedModules[index], [field]: value };
        }
        setModules(updatedModules);
    };

    

     const validateForm = () => {
        const errors: string[] = [];
        const today = new Date();

        if (!totalAmount || totalAmount <= 0) {
            errors.push('Total Amount is required and must be greater than zero.');
        }

        if (numModules <= 0 || numModules > maxModules) {
            errors.push(`Number of modules must be between 1 and ${maxModules}.`);
        }

        let lastModuleDate: Date | null = null;
        modules.forEach((module, index) => {
            if (!module.heading) {
                errors.push(`Module ${index + 1} heading is required.`);
            }

            if (!module.date) {
                errors.push(`Module ${index + 1} date is required.`);
            } else {
                const moduleDate = new Date(module.date);
                if (moduleDate <= today) {
                    errors.push(`Module ${index + 1} date must be in the future.`);
                }

                if (lastModuleDate) {
                    const timeDifference = Math.abs(moduleDate.getTime() - lastModuleDate.getTime());
                    const dayDifference = timeDifference / (1000 * 3600 * 24);
                    if (dayDifference < 4) {
                        errors.push(`Module ${index} and Module ${index + 1} dates must be at least 4 days apart.`);
                    }
                }

                lastModuleDate = moduleDate;
            }
        });

        return errors;
    };

    const handleSubmit = async() => {
        const errors = validateForm();
        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }
        let response
       if(isUserPost){
         response= await setModuleClientPost(projectId,modules)

       }else{
         response= await setModuleFreelancerPost(projectId,modules)
       }
       setProjectData((prevData) => {
        if (!prevData) return null; 
        return {
          ...prevData,
          modules: response.data, 
        };
      });
      
      

        closeModal()
        clearForm();
    };

    const clearForm = () => {
        setTotalAmount(1000);
        setNumModules(0);
        setModules([]);
        setFormErrors([]);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="mt-6  bg-white rounded-lg  max-w-lg ">
            <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={openModal}
            >
                Set Module Details
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Payment Form"
                className="relative mx-auto my-8 max-w-3xl p-11 bg-white rounded-lg shadow-md overflow-auto max-h-[80vh]"
                overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
            >
                <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Module Details</h2>

                <div className="mb-6">
                    <label>Enter Total Payment Amount</label>
                    <input
                        type="number"
                        placeholder="Total Amount"
                        value={totalAmount}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <div className="mb-6 flex items-center">
                    <label>Enter Number of Modules (1 to {maxModules})</label>
                    <div className="flex ml-4">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l-lg"
                            onClick={() => handleNumModulesChange(-1)}
                            disabled={numModules <= 0}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={numModules}
                            readOnly
                            className="w-12 text-center px-4 py-2 border-t border-b border-gray-300"
                        />
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r-lg"
                            onClick={() => handleNumModulesChange(1)}
                            disabled={numModules >= maxModules}
                        >
                            +
                        </button>
                    </div>
                </div>

                {numModules > 0 && (
                    <div className="space-y-4">
                        {modules.map((module, index) => (
                            <div key={index} className="flex items-center space-x-4">
                                <input
                                    type="text"
                                    placeholder={`Module ${index + 1} Heading`}
                                    value={module.heading}
                                    onChange={(e) => handleModuleChange(index, 'heading', e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                                />
                                <input
                                    type="date"
                                    value={module.date}
                                    onChange={(e) => handleModuleChange(index, 'date', e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                                />
                                <p>Amount: {module.amount.toString()=="NaN"?0:module.amount}</p>
                            </div>
                        ))}
                    </div>
                )}

                {formErrors.length > 0 && (
                    <ul className="mt-4 list-disc list-inside text-red-600">
                        {formErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}

                <div className="mt-6 flex justify-center">
                    <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        onClick={handleSubmit}
                    >
                        Submit Payment
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PaymentForm;
