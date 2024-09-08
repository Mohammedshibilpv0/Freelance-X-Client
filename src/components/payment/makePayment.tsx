

// import { useEffect, useState } from "react";
// import Store from "../../store/store";
// import { fetchClientData, freelancerWork,findClientRequests ,findFreelancerRequests,findFreelancerApprovedProjects,findClientApprovedProjects} from "../../api/user/userServices";
// import Pagination from "../../components/user/pagination/Pagination";
// import { useNavigate } from "react-router-dom";
// import Card from "../../components/user/Card/card";

// interface prop{
//     action:string
// }
// const ProjectListing:React.FC<prop> = ({action}) => {
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [totalPages, setTotalPages] = useState<number>(10);
//   const [projects, setProjects] = useState<any[]>([]);
//   const [clientData, setClientData] = useState<any[]>([]);
//   const [isEmpty,setIsEmpty]=useState<boolean>(false)
//   const limit = 4;
//   const navigate = useNavigate();
//   const user = Store((config) => config.user);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (user.role === "Freelancer") {
//         if(action=='myProject'){
//             const response = await freelancerWork(user.email, currentPage, limit);
//             if (response.data && response.data.length > 0) {
//               setProjects(response.data);
//               setTotalPages(response.totalPages);
//               setIsEmpty(false)
//             } else {
//               setProjects([]);
//             }
//         }else if(action=='myRequest'){
//             const response = await findFreelancerRequests(
//                 user.email,
//                 currentPage,
//                 limit
//               );
//               if(response.success==false){
//                 setIsEmpty(true)
//               }
//               if (response.data && response.data.posts.length > 0) {
//                 setProjects(response.data.posts);
//                 setTotalPages(response.totalPages);
//                 setIsEmpty(false)
//               } else {
//                 setClientData([]);
//               }
//         }else if(action=='approved'){
//             const response = await findFreelancerApprovedProjects(
//                 user.email,
//                 currentPage,
//                 limit
//               );
//               console.log(response.data)
//               if(response.success==false){
//                 setIsEmpty(true)
//               }
//               if (response.data && response.data.posts.length > 0) {
//                 setProjects(response.data.posts);
//                 setTotalPages(response.totalPages);
//                 setIsEmpty(false)
//               } else {
//                 setClientData([]);
//               }
//          }

//         } else if (user.role === "Client") {
//          if(action=='myProject'){
//             const response = await fetchClientData(
//                 user.email,
//                 currentPage,
//                 limit
//               );
//               if (response.data && response.data.posts.length > 0) {
//                 setClientData(response.data.posts);
//                 setTotalPages(response.totalPages);
//                 setIsEmpty(false)
//               } else {
//                 setClientData([]);
//               }
//          }else if(action=='myRequest'){
//             const response = await findClientRequests(
//                 user.email,
//                 currentPage,
//                 limit
//               );
//               if(response.success==false){
//                 setIsEmpty(true)
//               }
//               if (response.data && response.data.posts.length > 0) {
//                 setClientData(response.data.posts);
//                 setTotalPages(response.totalPages);
//                 setIsEmpty(false)
//               } else {
//                 setClientData([]);
//               }
//          }else if(action=='approved'){
//             const response = await findClientApprovedProjects(
//                 user.email,
//                 currentPage,
//                 limit
//               );
//               if(response.success==false){
//                 setIsEmpty(true)
//               }
//               if (response.data && response.data.posts.length > 0) {
//                 setClientData(response.data.posts);
//                 setTotalPages(response.totalPages);
//                 setIsEmpty(false)
//               } else {
//                 setClientData([]);
//               }
//          }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
    
//     fetchData();
//   }, [currentPage, user.email, user.role,action]);

//   if (isEmpty) {
//     return ( 
//         <div className="flex items-center justify-center h-full">
//             <h1 className="text-center">There is no data</h1>
//         </div>
//     );
// }

// const handleLinkFreelance=(projectId:string)=>{
//       if(action=='myProject'){
//         navigate(`/projectdetail/${projectId}/?myproject=true&freelancer=true`)
//       }else if(action=='myRequest' ){
//         navigate(`/projectdetail/${projectId}/?freelancer=true&request=true`)
//       }else if(action=='approved'){
//         navigate(`/projectdetail/${projectId}/?myproject=true&freelancer=true&request=true`)  
//       }
// }

// const handleLinkClink = (projectId:string)=>{
//     if(action=='myProject'){
//         navigate(`/projectdetail/${projectId}/?myproject=true&client=true`)   
//        }else if(action=='myRequest' ){
//         navigate(`/projectdetail/${projectId}/?client=true&request=true`)  
//       }else if(action=='approved'){
//         navigate(`/projectdetail/${projectId}/?myproject=true&client=true&request=true`)  
//       }
// }

//   return (
//     <>
//       {user.role === "Freelancer" && projects.length > 0 ? (
//         <div className="ms-4 mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-12">
//           {projects.map((project, index) => (
//             <div
//               key={index}
//               onClick={()=>handleLinkFreelance(project._id)}
//             >
//               <Card imageSrc={project.images[0]} title={project.projectName} />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p></p>
//       )}
//       {user.role === "Client" && clientData.length > 0 ? (
//         <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
//           {clientData.map((data, index) => (
//             <div
//               key={index}
//               onClick={() =>handleLinkClink(data._id)}
//             >
//               <Card imageSrc={data.images[0]} title={data.projectName} />
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p></p>
//       )}
      
      
//     </>
//   );
// };

// export default ProjectListing;
