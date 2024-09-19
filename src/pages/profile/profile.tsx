import Store from "../../store/store";
import { MdVerified, MdOutlineMailOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaLanguage, FaPhoneAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Editprofile from "./Mangeprofile";
import { animateScroll as scroll } from "react-scroll";
import ProjectListing from "./projectListing";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isEdit = searchParams.get("stats") === "completeprofile";
  const user = Store((config) => config.user);
  const [editUser, setEditUser] = useState<boolean>(isEdit);
  const editProfileRef = useRef<HTMLDivElement>(null);
  const [action,setAction]=useState<string>('myProject')

  useEffect(() => {
    scroll.scrollToTop({
      duration: 1000,
      smooth: "easeInOutQuad",
    });
  }, [editUser]);

 

  const handleEditUser = () => {
    setEditUser(!editUser);
  };

  return (
    <section className="bg-gray-100 fade-in">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 px-4 ">
          <div className="lg:col-span-3 ">
            <article className="bg-white shadow rounded-lg p-6 mb-6 ">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Profile</h3>
                <p
                  className="text-blue-700 cursor-pointer text-sm"
                  onClick={handleEditUser}
                >
                  {!editUser ? "Edit" : ""}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={
                    user.profile
                      ? user.profile
                      : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
                  }
                  className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 object-cover"
                />
                <h3 className="text-lg mb-2">
                  {user.firstName} {user.secondName}
                </h3>
                <p className="flex items-center text-gray-700">
                  <MdVerified className="mr-2" color="blue" />
                  {user.role}
                </p>
              </div>
              <hr className="my-6 border-t border-gray-300" />
              <div className="flex items-center text-gray-700">
                <FaLanguage className="mr-3" />
                <p>{user.language ? user.language : "English"}</p>
              </div>
              <div className="flex items-center text-gray-700 mt-3">
                <FaLocationDot className="mr-3" />
                <p>{user.country ? user.country : ""}</p>
              </div>
              <div className="flex items-center text-gray-700 mt-3">
                <MdOutlineMailOutline className="mr-3" />
                <p>{user.email}</p>
              </div>
              <div className="flex items-center text-gray-700 mt-3">
                <FaPhoneAlt className="mr-3" />
                <p>{user.phone}</p>
              </div>
            </article>
            <article className="bg-white shadow rounded-lg p-6">
              <div className="flex mb-4">
                <p className="text-gray-700 font-semibold">Description</p>
              </div>
              <div className="max-w-full overflow-hidden">
                <p className="text-gray-700 break-words">{user.description}</p>
              </div>
              <hr className="my-6 border-t border-gray-300" />
              <div className="flex mb-4">
                <p className="text-gray-700 font-semibold">Skills</p>
              </div>
              <div className="max-w-full overflow-hidden">
                {user.skills.map((skill, index) => (
                  <p
                    key={index}
                    className="bg-blue-50 inline-block px-2 py-1 text-gray-700 ms-2 mt-2"
                  >
                    {skill}
                  </p>
                ))}
              </div>
            </article>
          </div>
          <div className="lg:col-span-6 bg-white shadow rounded-lg p-6">
            {editUser? (
              <div ref={editProfileRef}>
                <Editprofile
                  title={isEdit?'Complete the profile':`Edit Profile`}
                  setEditUser={setEditUser}
                  scrollToRef={editProfileRef}
                  handleeditUser={handleEditUser}
                />
              </div>
            ):(
              <div>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-6">
                <p
                  onClick={() => setAction('myProject')}
                  className={`cursor-pointer ${action === 'myProject' ? 'text-blue-400' : 'text-gray-700'} mb-2 sm:mb-0`}
                >
                  My Projects
                </p>
                <p
                  onClick={() => setAction('myRequest')}
                  className={`cursor-pointer ${action === 'myRequest' ? 'text-blue-400' : 'text-gray-700'} mb-2 sm:mb-0`}
                >
                  My Requests
                </p>
                <p
                  onClick={() => setAction('approved')}
                  className={`cursor-pointer ${action === 'approved' ? 'text-blue-400' : 'text-gray-700'} mb-2 sm:mb-0`}
                >
                  Approved
                </p>
                <p
                  onClick={() => setAction('myTransaction')}
                  className={`cursor-pointer ${action === 'myTransaction' ? 'text-blue-400' : 'text-gray-700'} mb-2 sm:mb-0`}
                >
                  My Transactions
                </p>
              </div>
              <div className="flex flex-wrap ms-2 items-center text-gray-700 bg-white">
                <ProjectListing action={action} />
              </div>
            </div>
            
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
