import React, { useEffect, useState } from 'react';
import { findUser } from '../../../api/user/userServices';

interface prop {
  id: string;
}

interface userType {
  firstName: string;
  secondName: string;
  skills?: string[];
  createAt: Date;
  profile: string;
  description: string;
}

const UserDetails: React.FC<prop> = ({ id }) => {
  const [user, setUser] = useState<userType | null>(null);

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
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
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
    </div>
  );
};

export default UserDetails;
