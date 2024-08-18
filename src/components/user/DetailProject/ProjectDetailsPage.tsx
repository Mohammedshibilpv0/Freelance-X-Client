import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getFreelancerWorkById,
  getClientPostById,
} from "../../../api/user/userServices";
import Carousal from "../Carousal/Carousal";
import Loading from "../../../style/loading";

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

export interface IProject {
  projectName: string;
  description: string;
  skills: string[];
  startBudget: string;
  endBudget: string;
  deadline: Date;
  keyPoints: string[];
  searchTags: [];
  images: string[];
  searchKey: string[];
  category: Category | string;
  subcategory: SubCategory | string;
  price?: string | number;
  createAt: string;
}

const ProjectDetailsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id } = useParams();
  const myProject = searchParams.get("myproject") == "true";
  const freelancer = searchParams.get("freelancer") === "true";
  const client = searchParams.get("client") === "true";
  const [projectData, setProjectData] = useState<IProject | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (freelancer && id) {
          const response = await getFreelancerWorkById(id);
          setProjectData(response.data);
        }
        if (client && id) {
          const response = await getClientPostById(id);
          setProjectData(response.data);
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

  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4 ">
        <div className="md:w-1/2">
          <Carousal data={{ images: projectData.images }} />
          <div className="mt-7">
            {client && (
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
              {client ? "Skill Required" : "Search Key"}
            </h2>
            <div className="flex flex-wrap gap-2 mt-5">
              {client && Array.isArray(projectData.skills)
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

      <div className="sticky top-6 bg-white shadow-md rounded-lg p-4">
        {myProject ? (
          <>
            <img
              src="data:image/png;base64,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"
              alt="Camila Pereira"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="text-center">
              <button className="bg-green-500 text-white py-2 px-4 rounded mt-4">
                Hire Camila
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">This is your project.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
