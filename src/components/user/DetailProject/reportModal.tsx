import React, { useState } from 'react';
import { reportUser } from '../../../api/user/userServices';
import useShowToast from '../../../Custom Hook/showToaster';
import Store from '../../../store/store';

interface ReportModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, userId }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [customReason, setCustomReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const myId=Store((config)=>config.user._id)
  const Toast= useShowToast()

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (selectedReason === "Other" && !customReason) return;
  
    const reportReason = selectedReason === "Other" ? customReason : selectedReason;
    if (!reportReason) return;
  
    setLoading(true);
    setError("");
  
    try {
      const response = await reportUser(userId, reportReason!, myId, customReason); 
  
      if (response.message === 'success') {
        Toast('Report sent to admin', 'success', true);
        onClose();
      } else {
        Toast('Something went wrong, please try again later', 'error', true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Report User</h2>
        <p className="mb-4">Please select a reason for reporting this user:</p>
        <div className="flex flex-col space-y-2 mb-4">
          {["Spam", "Inappropriate Content", "Harassment", "Other"].map((reason) => (
            <button
              key={reason}
              className={`py-2 px-4 rounded-md hover:bg-gray-200 ${
                selectedReason === reason ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => setSelectedReason(reason)}
              disabled={loading}
            >
              {reason}
            </button>
          ))}
        </div>
        {selectedReason === "Other" && (
          <div className="mb-4">
            <textarea
              className="w-full border p-2 rounded-md"
              placeholder="Please specify..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              disabled={loading}
            />
          </div>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleSubmit}
            disabled={loading || !selectedReason}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
