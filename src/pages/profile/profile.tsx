import Store from "../../store/store";
import { MdVerified, MdOutlineMailOutline } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaLanguage, FaPhoneAlt } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Editprofile from "./Mangeprofile";
import { animateScroll as scroll } from "react-scroll";
import Card from "../../components/user/Card/card";
import { freelancerWork, fetchClientData } from "../../api/user/userServices";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/user/pagination/Pagination";

const Profile = () => {
  const user = Store((config) => config.user);
  const [editUser, setEditUser] = useState<boolean>(false);
  const [projects, setProjects] = useState<any[]>([]); 
  const [clientData, setClientData] = useState<any[]>([]); 
  const editProfileRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10);
  const limit = 4;
  const navigate = useNavigate();

  useEffect(() => {
    scroll.scrollToTop({
      duration: 1000,
      smooth: "easeInOutQuad",
    });
  }, [editUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === "Freelancer") {
          const response = await freelancerWork(user.email, currentPage, limit);
          if (response.data && response.data.length > 0) {
            setProjects(response.data);
            setTotalPages(response.totalPages);
          } else {
            setProjects([]);
          }
        } else if (user.role === "Client") {
          const response = await fetchClientData(user.email, currentPage, limit); 
          if (response.data && response.data.posts.length > 0) {
            setClientData(response.data.posts);
            setTotalPages(response.totalPages);
          } else {
            setClientData([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, user.email, user.role]);

  const handleEditUser = () => {
    setEditUser(!editUser);
  };

  return (
    <section className="bg-gray-100 fade-in">
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 px-4">
          <div className="lg:col-span-3">
            <article className="bg-white shadow rounded-lg p-6 mb-6">
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
                <p>{user.location ? user.location : "India"}</p>
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
            {editUser && (
              <div ref={editProfileRef}>
                <Editprofile
                  title={"Edit Profile"}
                  setEditUser={setEditUser}
                  scrollToRef={editProfileRef}
                  handleeditUser={handleEditUser}
                />
              </div>
            )}
            <div>
              <div className="flex flex-wrap ms-2 items-center text-gray-700 bg-white">
                <p className="w-full">My Projects</p>
                {user.role === "Freelancer" && projects.length > 0 ? (
                  <div className="ms-4 mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-12">
                    {projects.map((project, index) => (
                      <div key={index} onClick={() => navigate(`/projectdetail/${project._id}/?myproject=true&freelancer=true`)}>
                        <Card
                          imageSrc={project.images[0]}
                          title={project.projectName}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p></p>
                )}
                {user.role === "Client" && clientData.length > 0 ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
                    {clientData.map((data, index) => (
                      <div key={index} onClick={() => navigate(`/projectdetail/${data._id}/?myproject=true&client=true`)}>
                      <Card
                        imageSrc={data.images[0]}
                        title={data.projectName}
                      />
                    </div>
                    ))}
                  </div>
                ) : (
                  <p></p>
                )}
                <div className="flex justify-end">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
