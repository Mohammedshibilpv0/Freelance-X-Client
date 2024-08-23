import React, { useEffect, useState } from "react";
import { findUser, requstingProject } from "../../../api/user/userServices";
import Store from "../../../store/store";
import { useLocation } from "react-router-dom";

export interface requestInterface {
  id?: string;
  message: string;
  price: number;
  freelancerId?: {
    _id?: string;
    email: string;
  };
  status?: string;
}

interface prop {
  id: string;
  projectId: string | undefined;
  matchingRequest: requestInterface | null | undefined;
}

interface userType {
  firstName: string;
  secondName: string;
  skills?: string[];
  createAt: Date;
  profile: string;
  description: string;
}

const UserDetails: React.FC<prop> = ({
  id,
  projectId = undefined,
  matchingRequest = null,
}) => {
  const [user, setUser] = useState<userType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [priceError, setPriceError] = useState("");
  const [status,setStatus]=useState(matchingRequest?.status)
  const role = Store((config) => config.user.role);
  const email = Store((config) => config.user.email);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const myProject = searchParams.get("myproject") == "true";

  useEffect(() => {
    if (id) {
      async function fetchUser() {
        const response = await findUser(id);
        setUser(response.data);
      }
      fetchUser();
    }
  }, [id]);

  const formatDate = (dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSendRequest = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
    setPriceError("");
  };

  const handleSubmitRequest = async () => {
    let isValid = true;

    if (message.length < 6) {
      setErrorMessage("Message must be more than 5 characters.");
      isValid = false;
    } else {
      setErrorMessage("");
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      setPriceError("Please enter a valid positive number for the price.");
      isValid = false;
    } else {
      setPriceError("");
    }

    if (isValid) {
      if (projectId) {
        const submitRequest = await requstingProject(
          email,
          projectId,
          message,
          price,
          role
        );
        if (submitRequest) {
          setIsModalOpen(false);
          setStatus('Pending'); 
        }
      }
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <p className="mb-5">Content Creator Details</p>
      <img
        src={user.profile}
        alt={`${user.firstName} ${user.secondName}`}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
      />
      <div className="flex mt-8">
        <p>Full Name:</p>
        <h2 className="ms-4 text-lg font-semibold mb-2">
          {user.firstName} {user.secondName}
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        Description:<span className="ms-3">{user.description}</span>
      </p>
      <div className="text-gray-600 mb-4">
        Member Since: <span className="ms-1">{formatDate(user.createAt)}</span>
      </div>
      {role !== "Freelancer" && (
        <div className="flex flex-wrap space-x-2">
          Skills:
          {user.skills?.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 ms-5 text-blue-600 text-sm font-medium px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-14">
        {!matchingRequest &&
          (myProject ? (
            <button
              className="p-3 bg-green-500 rounded-md text-white text-md font-semibold"
            >
              Message
            </button>
          ) : (
            <button
              className="p-3 bg-green-500 rounded-md text-white text-md font-semibold cursor-pointer"
              onClick={handleSendRequest}
              disabled={status=='Pending'}
            >
              {status=='Pending'?status:'Send Request'}
            </button>
          ))}

        {matchingRequest && (
          <p className="p-3 bg-green-500 rounded-md text-white text-md font-semibold">
            {status}
          </p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Send Request</h2>
            <textarea
              className="w-full border p-2 mb-2 rounded-md"
              rows={4}
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}
            <input
              type="number"
              className="w-full border p-2 mb-2 rounded-md"
              placeholder="Enter your price..."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {priceError && (
              <p className="text-red-500 text-sm mb-4">{priceError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md"
                onClick={handleSubmitRequest}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
