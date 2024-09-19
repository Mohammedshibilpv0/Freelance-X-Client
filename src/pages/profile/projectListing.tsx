// import { useEffect, useState } from "react";
// import Store from "../../store/store";
// import {
//   fetchClientData,
//   freelancerWork,
//   findClientRequests,
//   findFreelancerRequests,
//   findFreelancerApprovedProjects,
//   findClientApprovedProjects,
//   deleteProject,
// } from "../../api/user/userServices";
// import Pagination from "../../components/user/pagination/Pagination";
// import { useNavigate } from "react-router-dom";
// import Card from "../../components/user/Card/card";
// import EmptyData from "../../components/user/empty/Empty";
// import Transaction from "./transaction";
// import { IoMdMore } from "react-icons/io";
// import { FiEdit, FiTrash } from "react-icons/fi";
// import useShowToast from "../../Custom Hook/showToaster";
// import { IProject } from "../../components/user/DetailProject/ProjectDetailsPage";
// import DeleteConfirmationModal from "../../components/user/DeleteConfirmationModal/DeleteConfirmationModal";

// interface Prop {
//   action: string;
// }

// const ProjectListing: React.FC<Prop> = ({ action }) => {
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(10);
//   const [projects, setProjects] = useState<IProject[]>([]);
//   const [isEmpty, setIsEmpty] = useState<boolean>(false);
//   const [transaction, setTransaction] = useState<boolean>();
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null); 
//   const limit = 4;
//   const Toast= useShowToast()
//   const navigate = useNavigate();
//   const user = Store((config) => config.user);

//   const toggleDropdown = (index: number) => {
//     if (openDropdownIndex === index) {
//       setOpenDropdownIndex(null); 
//     } else {
//       setOpenDropdownIndex(index); 
//     }
//   };

//   const handleDeleteProject= async (projectId:string,projectStatus:string)=>{
//     try{
//       if(projectStatus==='Approved'){
//         Toast("The project is ongoing you can't delete the project",'error',true)
//         return
//       }else{
//         const role=user.role
//         const response= await deleteProject(role,projectId)
//         if(response.message){
//           Toast("Project is deleted successfully",'success',true)
//           setProjects((prev) => prev.filter(project => project._id !== projectId))
//         }
//         setModalOpen(false); 
//       }
      
//     }catch(err){
//       Toast('Something wrong in deleting the project','error',true)
//     }
//   }

//   const openModal = () => setModalOpen(true);
//   const closeModal = () => setModalOpen(false);
//   const confirmDelete = () => handleDeleteProject(projects._id, project.status);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let response;
//         if (action === "myTransaction") {
//           setTransaction(true);
//           setProjects([]); 
//           setIsEmpty(false);
//         } else {
//           setTransaction(false); 

//           if (user.role === "Freelancer") {
//             if (action === "myProject") {
//               response = await freelancerWork(user.email, currentPage, limit);
//             } else if (action === "myRequest") {
//               response = await findFreelancerRequests(user.email, currentPage, limit);
//             } else if (action === "approved") {
//               response = await findFreelancerApprovedProjects(user.email, currentPage, limit);
//             }
//           } else if (user.role === "Client") {
//             if (action === "myProject") {
//               response = await fetchClientData(user.email, currentPage, limit);
//             } else if (action === "myRequest") {
//               response = await findClientRequests(user.email, currentPage, limit);
//             } else if (action === "approved") {
//               response = await findClientApprovedProjects(user.email, currentPage, limit);
//             }
//           }

//           if (response && response.data && response.data.posts.length > 0) {
//             setProjects(response.data.posts);
//             setTotalPages(response.totalPages);
//             setIsEmpty(false);
//           } else {
//             setIsEmpty(true);
//             setProjects([]);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [currentPage, user.email, user.role, action]);

//   const handleLink = (projectId: string) => {
//     let url = `/projectdetail/${projectId}/?`;

//     if (user.role === "Freelancer") {
//       if (action === "myProject") url += "myproject=true&freelancer=true";
//       else if (action === "myRequest") url += "freelancer=true&request=true";
//       else if (action === "approved")
//         url += "myproject=true&freelancer=true&request=true";
//     } else if (user.role === "Client") {
//       if (action === "myProject") url += "myproject=true&client=true";
//       else if (action === "myRequest") url += "client=true&request=true";
//       else if (action === "approved")
//         url += "myproject=true&client=true&request=true";
//     }

//     navigate(url);
//   };

//   if (isEmpty) {
//     return (
//       <div className="flex items-center justify-center h-[85vh] w-full">
//         <EmptyData />
//       </div>
//     );
//   }

//   return (
//     <div  >
//       {transaction ? (
//         <Transaction />
//       ) : (
//         <>
//           {projects.length > 0 ? (
//             <div className="ms-4 mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-12">
//               {projects.map((project, index) => (
//                 <div key={index} className="relative bg-white rounded-lg p-4">
                  
//                   {action === "myProject" && (
//                     <IoMdMore
//                       className="absolute top-2 right-2 text-black bg-gray-200 p-1 rounded-full cursor-pointer"
//                       size={24}
//                       onClick={() => toggleDropdown(index)}
//                     />
//                   )}

//                   {openDropdownIndex === index && ( 
//                     <div className="absolute top-10 right-0 w-40 bg-white shadow-lg rounded-lg py-2 z-10">
//                       <button
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                         onClick={() => alert("Edit clicked")}
//                       >
//                         <FiEdit className="mr-2" /> Edit
//                       </button>
//                       <button
//         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//         onClick={openModal}
//       >
//         <FiTrash className="mr-2" /> Delete
//       </button>

//       {/* Modal for confirmation */}
//       <DeleteConfirmationModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         onConfirm={confirmDelete}
//       />
//                     </div>
//                   )}

//                   <div className="rounded-lg mt-4" onClick={() => handleLink(project._id)}>
//                     <Card
//                       imageSrc={project.images[0]}
//                       title={project.projectName}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex justify-center items-center w-full h-[78vh] bg-black">
//               <EmptyData />
//             </div>
//           )}
//         </>
//       )}

//       {transaction === false && (
//         <div className="flex justify-end mt-7 me-5">
//           {projects.length > 0 && (
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//             />
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectListing;



import { useEffect, useState } from "react";
import Store from "../../store/store";
import {
  fetchClientData,
  freelancerWork,
  findClientRequests,
  findFreelancerRequests,
  findFreelancerApprovedProjects,
  findClientApprovedProjects,
  deleteProject,
} from "../../api/user/userServices";
import Pagination from "../../components/user/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Card from "../../components/user/Card/card";
import EmptyData from "../../components/user/empty/Empty";
import Transaction from "./transaction";
import { IoMdMore } from "react-icons/io";
import { FiEdit, FiTrash } from "react-icons/fi";
import useShowToast from "../../Custom Hook/showToaster";
import { IProject } from "../../components/user/DetailProject/ProjectDetailsPage";
import DeleteConfirmationModal from "../../components/user/DeleteConfirmationModal/DeleteConfirmationModal";

interface Prop {
  action: string;
}

const ProjectListing: React.FC<Prop> = ({ action }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<IProject | null>(null); // Project to delete
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const limit = 4;
  const Toast = useShowToast();
  const navigate = useNavigate();
  const user = Store((config) => config.user);

  const toggleDropdown = (index: number) => {
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      setOpenDropdownIndex(index);
    }
  };

  const handleDeleteProject = async (projectId: string, projectStatus: string) => {
    try {
      if (projectStatus === 'Approved') {
        Toast("The project is ongoing you can't delete the project", 'error', true);
        return;
      }
      const role = user.role;
      const response = await deleteProject(role, projectId);
      if (response.message) {
        Toast("Project is deleted successfully", 'success', true);
        setProjects((prev) => prev.filter(project => project._id !== projectId));
      }
      setModalOpen(false);
    } catch (err) {
      Toast('Something went wrong while deleting the project', 'error', true);
    }
  };

  const openModal = (project: IProject) => {
    setProjectToDelete(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setProjectToDelete(null);
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      handleDeleteProject(projectToDelete._id, projectToDelete.status);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (action === "myTransaction") {
          setTransaction(true);
          setProjects([]);
          setIsEmpty(false);
        } else {
          setTransaction(false);

          if (user.role === "Freelancer") {
            if (action === "myProject") {
              response = await freelancerWork(user.email, currentPage, limit);
            } else if (action === "myRequest") {
              response = await findFreelancerRequests(user.email, currentPage, limit);
            } else if (action === "approved") {
              response = await findFreelancerApprovedProjects(user.email, currentPage, limit);
            }
          } else if (user.role === "Client") {
            if (action === "myProject") {
              response = await fetchClientData(user.email, currentPage, limit);
            } else if (action === "myRequest") {
              response = await findClientRequests(user.email, currentPage, limit);
            } else if (action === "approved") {
              response = await findClientApprovedProjects(user.email, currentPage, limit);
            }
          }

          if (response && response.data && response.data.posts.length > 0) {
            setProjects(response.data.posts);
            setTotalPages(response.totalPages);
            setIsEmpty(false);
          } else {
            setIsEmpty(true);
            setProjects([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, user.email, user.role, action]);

  const handleLink = (projectId: string) => {
    let url = `/projectdetail/${projectId}/?`;

    if (user.role === "Freelancer") {
      if (action === "myProject") url += "myproject=true&freelancer=true";
      else if (action === "myRequest") url += "freelancer=true&request=true";
      else if (action === "approved") url += "myproject=true&freelancer=true&request=true";
    } else if (user.role === "Client") {
      if (action === "myProject") url += "myproject=true&client=true";
      else if (action === "myRequest") url += "client=true&request=true";
      else if (action === "approved") url += "myproject=true&client=true&request=true";
    }

    navigate(url);
  };

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-[85vh] w-full">
        <EmptyData />
      </div>
    );
  }

  return (
    <div>
      {transaction ? (
        <Transaction />
      ) : (
        <>
          {projects.length > 0 ? (
            <div className="ms-4 mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-12">
              {projects.map((project, index) => (
                <div key={index} className="relative bg-white rounded-lg p-4">
                  {action === "myProject" && (
                    <IoMdMore
                      className="absolute top-2 right-2 text-black bg-gray-200 p-1 rounded-full cursor-pointer"
                      size={24}
                      onClick={() => toggleDropdown(index)}
                    />
                  )}

                  {openDropdownIndex === index && (
                    <div className="absolute top-10 right-0 w-40 bg-white shadow-lg rounded-lg py-2 z-10">
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => alert("Edit clicked")}
                      >
                        <FiEdit className="mr-2" /> Edit
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => openModal(project)}
                      >
                        <FiTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  )}

                  <div className="rounded-lg mt-4" onClick={() => handleLink(project._id)}>
                    <Card
                      imageSrc={project.images[0]}
                      title={project.projectName}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            setIsEmpty(true)
          )}
        </>
      )}


      {transaction === false && (
        <div className="flex justify-end mt-7 me-5">
          {projects.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProjectListing;
