import React, { useState } from 'react';
import ConfirmDialog from '../../../Custom Hook/sweetAlert'; 
import useShowToast from '../../../Custom Hook/showToaster';

interface Applicant {
    _id: string;
    name: string;
    status: 'non' | 'accept' | 'rejected';
}

interface ApplicantsListProps {
    applicantss: Applicant[];
}

const ApplicantstaList: React.FC<ApplicantsListProps> = ({ applicantss }) => {
    const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const Toaster = useShowToast();
    const applicants = [
        { id: 1, name: 'Mohamemed Shibil PV', status: 'non' },
        { id: 2, name: 'Jane Smith', status: 'non' },
        { id: 3, name: 'Alice Johnson', status: 'rejected' },
    ];


    const handleReject = (applicant: Applicant) => {
        setSelectedApplicant(applicant);
        setShowDialog(true);
    };

    const handleConfirm = () => {
        if (selectedApplicant) {
            Toaster(`${selectedApplicant.name} has been rejected.`, 'success', true);
            setShowDialog(false);
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
                    {applicants.map((applicant) => (
                        <tr key={applicant._id}>
                            <td className="px-4 py-2 border-b">{applicant.name}</td>
                            <td className="px-4 py-2 border-b">
                                {applicant.status === 'rejected' ? (
                                    <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600" disabled>
                                        Rejected
                                    </button>
                                ) : (
                                    <>
                                        <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600">
                                            Accept
                                        </button>
                                        <button
                                            className="px-4 py-2 ms-2 text-white bg-red-500 rounded hover:bg-red-600"
                                            onClick={() => handleReject(applicant)}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showDialog && selectedApplicant && (
                <ConfirmDialog
                    title={`Are you sure you want to reject ${selectedApplicant.name}?`}
                    text="This action cannot be undone."
                    confirmText="Yes, reject it!"
                    cancelText="Cancel"
                    onConfirm={handleConfirm}
                />
            )}
        </div>
    );
};

export default ApplicantstaList;
