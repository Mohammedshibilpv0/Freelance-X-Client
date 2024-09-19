import React, { useState } from 'react';
import { changeStatus } from '../../../api/user/userServices';
import Store from '../../../store/store';
import { IProject } from './ProjectDetailsPage';
import { socket } from '../../../socket/socket';

export interface Applicant {
    _id?: string;
    message: string;
    price: number;
    userId?: {
        _id: string;
        email: string;
        firstName: string;
        secondName: string;
    }
    status?: string;
}

interface ApplicantsListProps {
    applicantss: Applicant[];
    projectData:IProject
    setProjectData:React.Dispatch<React.SetStateAction<IProject | null>>
}

const ApplicantstaList: React.FC<ApplicantsListProps> = ({ applicantss,projectData,setProjectData}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [id, setId] = useState<string | null | undefined>(null);
    const [applicantId,setApplicantId]=useState<string|undefined|null>(null)
    const role = Store((config) => config.user.role);
    const currentUserId=Store((config) => config.user._id);

    const handleViewClick = (
        objId: string | undefined,
        message: string,
        price: number,
        firstName: string | undefined,
        secondName: string | undefined,
        applicantsId:string|undefined
    ) => {
        const applicantName = `${firstName ?? ''} ${secondName ?? ''}`;
        setSelectedMessage(message);
        setId(objId);
        setAmount(price);
        setName(applicantName);
        setShowDialog(true);
        setApplicantId(applicantsId)
    };

    const closeModal = () => {
        setShowDialog(false);
        setSelectedMessage(null);
    };

    const handleSubmit = async () => {
        if (id) {
            await changeStatus(id, role, 'Approved',amount??0);
    
            if (projectData && projectData.requests) {
                const updatedRequests = projectData.requests.map((request) =>
                    request._id === id ? { ...request, status: 'Approved' } : request
                );
                setProjectData((prevData) =>
                    prevData ? { ...prevData, requests: updatedRequests } : null
                );
            }
    
            setSelectedMessage(null);
            setId(null);
            setAmount(null);
            setName(null);
            setShowDialog(false);
            const text=`Your ${projectData.projectName} project is Approved please check your profile`
            socket.emit('sendNotification', {userId: currentUserId, receiverId:applicantId,text,link:'/profile',type:'job' });
        }
    };
    

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left border-b">Name</th>
                        <th className="px-4 py-2 text-left border-b">Action</th>
                    </tr>
                </thead>
              
                 <tbody>
                    {applicantss.map((applicant) => (
                        <tr key={applicant._id}>
                            <td className="px-4 py-2 border-b">
                                {applicant.userId?.firstName} {applicant.userId?.secondName}
                            </td>
                            <td className="px-4 py-2 border-b">
                                <button 
                                    onClick={() => handleViewClick(applicant._id,applicant.message,applicant.price,applicant.userId?.firstName,applicant.userId?.secondName,applicant.userId?._id)} 
                                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold mb-4">Applicant Message</h2>
                        <p className="mb-4">
                            Applicant Name: <span>{name}</span>
                        </p>
                        <p className="mb-4">
                            Description: <span>{selectedMessage}</span>
                        </p>
                        <p className="mb-4">
                            Price: <span>{amount}</span>
                        </p>
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 mr-2"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantstaList;
