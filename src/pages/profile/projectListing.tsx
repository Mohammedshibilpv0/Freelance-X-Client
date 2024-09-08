import { useEffect, useState } from "react";
import Store from "../../store/store";
import {
  fetchClientData,
  freelancerWork,
  findClientRequests,
  findFreelancerRequests,
  findFreelancerApprovedProjects,
  findClientApprovedProjects,
} from "../../api/user/userServices";
import Pagination from "../../components/user/pagination/Pagination";
import { useNavigate } from "react-router-dom";
import Card from "../../components/user/Card/card";

interface Prop {
  action: string;
}

const ProjectListing: React.FC<Prop> = ({ action }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(10);
  const [projects, setProjects] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const limit = 4;
  const navigate = useNavigate();
  const user = Store((config) => config.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
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
      <div className="flex items-center justify-center h-full">
        <h1 className="text-center">There is no data</h1>
      </div>
    );
  }

  return (
    <>
      {projects.length > 0 && (
        <div className="ms-4 mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-12">
          {projects.map((project, index) => (
            <div key={index} onClick={() => handleLink(project._id)}>
              <Card imageSrc={project.images[0]} title={project.projectName} />
            </div>
          ))}
        </div>
      )}
     
        <div className="flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      
    </>
  );
};

export default ProjectListing;