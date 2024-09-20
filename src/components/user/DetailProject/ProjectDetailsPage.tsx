import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js'
import {
  getFreelancerWorkById,
  getClientPostById,
  makePayemnt,
} from "../../../api/user/userServices";
import Carousal from "../Carousal/Carousal";
import UserDetails from "./userDetails";
import ApplicantstaList from "./applicantstaList";
import Store from "../../../store/store";
import PaymentForm from "../../payment/paymentForm";
import moment from 'moment';
import EmptyData from "../empty/Empty";
import { STRIPEKEY } from "../../../utility/env";
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

export interface requestInterface {
  _id?: string;
  message: string;
  price: number;
  userId?: {
    _id: string;
    email: string;
    firstName: string;
    secondName: string;
  };
  status?: string;
}
export interface projectModule{
  heading: string, 
  date: Date, 
  amount: number 
  isPaid:boolean
}

export interface IProject {
  _id:string;
  projectName: string;
  description: string;
  skills: string[];
  startBudget: string;
  endBudget: string;
  deadline: Date;
  keyPoints: string[];
  requests: requestInterface[];
  searchTags: [];
  images: string[];
  searchKey: string[];
  category: Category | string;
  subcategory: SubCategory | string;
  price?: string | number;
  createAt: string;
  paymentAmount?:string
  userId: string;
  status:string
  isDelete?:boolean
  modules:projectModule[]
}

const ProjectDetailsPage: React.FC = () => {
  const role=Store((config)=>config.user.role)
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { id } = useParams();
  const myProject = searchParams.get("myproject") === "true";
  const freelancer = searchParams.get("freelancer") === "true";
  const request = searchParams.get("request") === "true";
  const client = searchParams.get("client") === "true";
  const [loading,setLoading] =useState<boolean>(false)
  const [projectData, setProjectData] = useState<IProject | null>(null);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const email = Store((config) => config.user.email);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        let response;
        if (myProject) {
          if (freelancer && id) {
            response = await getFreelancerWorkById(id, request);
          } else if (client && id) {
            response = await getClientPostById(id, request);
            if (response.error) {
              setIsNotFound(true);
              return;
            }
          }
        } else {
          if (freelancer && id) {
            response = await getClientPostById(id);
          } else if (client && id) {
            response = await getFreelancerWorkById(id);
          }
        }
        setProjectData(response.data);
        setLoading(false)
      } catch (error) {
        console.log("Error fetching project data:", error);
        setLoading(false)
      }
    }

    fetchData();
  }, [freelancer, client, id, myProject, request]);

  if(loading){
    return (
      <div className="flex items-center justify-center mt-72">
        <Loading/>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center mt-72">
        {isNotFound ? <h1>Cannot find post</h1> : <EmptyData/>}
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

  const matchingRequest = projectData.requests?.find(
    (request) =>
      typeof request.userId === "object" && request.userId?.email === email
  );

  const approvedUser = projectData.requests?.find(
    (request) => request.status === "Approved"
  );

  const handlePay =async (data:projectModule,projectData:IProject)=>{
    try{
      const stripe= await loadStripe(STRIPEKEY??'')
      const response= await makePayemnt(data,projectData)

      const result=await stripe?.redirectToCheckout({
        sessionId:response.id
      })
      console.log(result)
      if(result?.error){
        console.log(result.error)
      }
    }catch(err){

    }
  }

  
  return (
    <>
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4">
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
        <UserDetails id={projectData.userId} projectId={id} matchingRequest={matchingRequest} />
      ) :( approvedUser && approvedUser.userId?._id ? (
        <UserDetails 
          id={role === 'Freelancer' ? projectData.userId : approvedUser.userId._id} 
          projectId={id} 
          matchingRequest={null} 
        />
      ) : (
          <ApplicantstaList applicantss={projectData.requests} projectData={projectData} setProjectData={setProjectData} />
        )
      )}

          {projectData.keyPoints && (
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-4">
            <div className="px-5">
              <h2 className="text-2xl font-medium mb-2">Key Points</h2>
              <ul className="list-disc ms-3">
                {projectData.keyPoints.map((key, index) => (
                  <li key={index}>{key}</li>
                ))}
              </ul>
            </div>
        </div>
      </div>
          )}
      {myProject && freelancer && projectData.status=='Approved'&& projectData.modules.length<=0   &&(
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6 ">
        <div className=" ">
          <h1>Project Module Details</h1>
          <PaymentForm projectId={id??''} isUserPost={projectData.startBudget?true:false} setProjectData={setProjectData} amount={projectData.paymentAmount??''}/>
          </div>
          </div>
      )}
    </div>
    {projectData.modules.length > 0 && (
      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h1 className="text-xl font-bold mb-4">Project Module Details</h1>
          
          <ul>
            {projectData.modules.map((module, index) => (
              <li key={index} className="mb-4">
                <div className="flex flex-row items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${module.isPaid ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium">Module {index + 1}</h2>
                    <p className="text-sm text-gray-600">{module.heading}</p>
                    <p className="text-sm text-gray-600">
                      {moment(module.date).format('MMMM Do YYYY')}
                    </p>
                    <p className="text-sm text-gray-600">Payment Amount : ${module.amount}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm">Payment Status: </span>
                      <div className={`ml-2 w-3 h-3 rounded-full ${module.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="ml-2 text-sm">{module.isPaid ? 'Paid' : 'Unpaid'}</span>

                    </div>

                    {role=='Client' && client && moment().isSameOrAfter(moment(module.date)) && !module.isPaid && (
                      <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handlePay(module,projectData)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <h1>Total Amount : $ {projectData.paymentAmount}</h1>
        </div>
      </div>
    )}


    </>
  );
};

export default ProjectDetailsPage;
