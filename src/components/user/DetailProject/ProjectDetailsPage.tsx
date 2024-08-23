import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getFreelancerWorkById,
  getClientPostById,
} from "../../../api/user/userServices";
import Carousal from "../Carousal/Carousal";
import Loading from "../../../style/loading";
import UserDetails from "./userDetails";
import ApplicantstaList from "./applicantstaList";
import Store from "../../../store/store";

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface SubCategory {
  _id: string;
  name: string;
  description: string;
  category: string;
}

export interface requestInterface {
 _id?: string;
  message: string;
  price: number;
  userId?: {
    _id: string;
    email: string;
    firstName:string
    secondName:string
  } 
  status?: string;
}


export interface IProject {
  projectName: string;
  description: string;
  skills: string[];
  startBudget: string;
  endBudget: string;
  deadline: Date;
  keyPoints: string[];
  requests:requestInterface[];
  searchTags: [];
  images: string[];
  searchKey: string[];
  category: Category | string;
  subcategory: SubCategory | string;
  price?: string | number;
  createAt: string;
  userId: string;
}

const ProjectDetailsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id } = useParams();
  const myProject = searchParams.get("myproject") == "true";
  const freelancer = searchParams.get("freelancer") === "true";
  const client = searchParams.get("client") === "true";
  const [projectData, setProjectData] = useState<IProject | null>(null);
  const email= Store((config)=>config.user.email)
  useEffect(() => {
    async function fetchData() {
      try {
        if (myProject) {
          if (freelancer && id) {
            const response = await getFreelancerWorkById(id);
            setProjectData(response.data);
          } else if (client && id) {
            const response = await getClientPostById(id);
            setProjectData(response.data);
          }
        } else {
          if (freelancer && id) {
            const response = await getClientPostById(id);
            setProjectData(response.data);
          } else if (client && id) {
            const response = await getFreelancerWorkById(id);
            setProjectData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    }
    fetchData();
  }, [freelancer, client, id]);

  if (!projectData) {
    return (
      <div className="flex items-center justify-center mt-72">
        <Loading />
      </div>
    );
  }
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "k";
    } else {
      return num.toString();
    }
  };

  const formattedDate = new Date(projectData.deadline).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const matchingRequest = projectData.requests?.find(request => 
    typeof request.userId === 'object' && request.userId?.email === email
  );
  
  const approvedUser = projectData.requests?.find(request => 
    typeof request.userId === 'object' && request.status === "Approved"
  );


  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr]  gap-6">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4 ">
        <div className="md:w-1/2">
          <Carousal data={{ images: projectData.images }} />
        </div>

        <div className="md:w-1/2 p-4 ms-5">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold mb-2">
                {projectData.projectName}
              </h1>
              <p className="text-right">
                {new Date(projectData.createAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mt-2">
                Category:{" "}
                <span className="ms-8">
                  {typeof projectData.category === "string"
                    ? projectData.category
                    : projectData.category?.name}
                </span>
              </p>
              <p className="text-gray-500 mt-3">
                Subcategory:{" "}
                <span className="ms-2">
                  {typeof projectData.subcategory === "string"
                    ? projectData.subcategory
                    : projectData.subcategory?.name}
                </span>
              </p>
            </div>

            <p className="text-gray-500 mt-3">
              Price:{" "}
              <span className="ms-16">
                {projectData.startBudget && projectData.endBudget
                  ? `${formatNumber(
                      Number(projectData.startBudget)
                    )} - ${formatNumber(Number(projectData.endBudget))}`
                  : formatNumber(Number(projectData.price))}
              </span>
            </p>
            <p className="mt-3">
              Deadline: <span className="ms-8"> {formattedDate}</span>{" "}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-700">{projectData.description}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 mt-3">
              {projectData.skills ? "Skills" : "Search tag"}
            </h2>
            <div className="flex flex-wrap gap-2 mt-5">
              {Array.isArray(projectData.skills)
                ? projectData.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                : Array.isArray(projectData.searchTags) &&
                  projectData.searchTags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
            </div>
          </div>
        </div>
      </div>
      {!myProject ? (
    <UserDetails id={projectData.userId} projectId={id} matchingRequest={matchingRequest}  />
) : (
    approvedUser && approvedUser?.userId?._id ? (
        <UserDetails id={approvedUser.userId._id} projectId={undefined} matchingRequest={null} />
    ) : (
        <ApplicantstaList applicantss={projectData.requests} projectData={projectData} setProjectData={setProjectData}/> 
    )
)}

      <div className="container mx-auto  py-6 ">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4 ">
            {projectData.keyPoints && (
              <div className="px-5">
                <h2 className="text-2xl font-medium mb-2">Key Points</h2>
                <ul className="list-disc ms-3">
                  {projectData.keyPoints.map((key, index) => (
                    <li key={index}>{key}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
