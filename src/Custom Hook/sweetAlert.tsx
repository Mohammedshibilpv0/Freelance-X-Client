import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React from 'react';

const MySwal = withReactContent(Swal);

interface ConfirmDialogProps {
    title?: string;
    text?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
    title, 
    text, 
    confirmText, 
    cancelText, 
    onConfirm 
}) => {
    const handleConfirm = () => {
        MySwal.fire({
            title: title || 'Are you sure?',
            text: text || '',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: confirmText || 'Yes, do it!',
            cancelButtonText: cancelText || 'Cancel',
        }).then((result) => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            }
        });
    };

    return (
        <button onClick={handleConfirm} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            Trigger Confirmation
        </button>
    );
};

export default ConfirmDialog;
