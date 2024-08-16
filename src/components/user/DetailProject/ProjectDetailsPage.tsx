import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getFreelancerWorkById, getClientPostById } from '../../../api/user/userServices';
import Carousal from '../Carousal/Carousal';



export interface IProject {
    projectName: string;
    description: string;
    skills: string[];
    startBudget: string;
    endBudget: string;
    deadline: string;
    keyPoints: string[];
    searchTags:[]
    images: string[];
    searchKey: string[];
    category: string;
    subcategory: string;
    price?:string|number
}

const ProjectDetailsPage: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { id } = useParams(); 
    const myProject = searchParams.get('myproject') === 'true';
    const freelancer = searchParams.get('freelancer') === 'true';
    const client = searchParams.get('client') === 'true';
    const [projectData, setProjectData] = useState<IProject|null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                if (freelancer && id) {
                    const response = await getFreelancerWorkById(id);
                    setProjectData(response.data);
                }
                if (client && id) {
                    const response = await getClientPostById(id);
                    // setProjectData(response.data);
                }
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        }
        fetchData();
    }, [freelancer, client, id]);

    if (!projectData) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 ove">  
          <div className="overflow-y-auto max-h-screen p-4 md:col-span-2 bg-white shadow-md rounded-lg ">

        
                                 <Carousal data={{images:projectData.images}}/>
                              
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 mt-7">{projectData.projectName}</h1>
              <span className="text-green-600 text-sm">Verified Expert in Marketing</span>
              <p className="text-gray-500 mt-2">Marketing Expert</p>
              <p className="text-gray-500">Madrid, Spain</p>
              <p className="text-gray-500">Toptal member since September 7, 2023</p>
            </div>
    
            {/* Expertise Tags */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Expertise</h2>
              <div className="flex flex-wrap gap-2">
               {client?projectData.skills:[].map((skill) => (
                  <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
    
            {/* Bio Section */}
            <div>
              <h2 className="text-xl font-bold mb-2">Bio</h2>
              <p className="text-gray-700">
                {projectData.description}
              </p>
            </div>
          </div>
    
          {/* Right Fixed Image Section */}
          <div className="sticky top-6 bg-white shadow-md rounded-lg p-4">
            <img 
              src="https://via.placeholder.com/300" 
              alt="Camila Pereira" 
              className="w-full h-48 object-cover rounded-lg mb-4" 
            />
            <div className="text-center">
              <p className="text-green-600">Camila is available for hire</p>
              <button className="bg-green-500 text-white py-2 px-4 rounded mt-4">Hire Camila</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Project Details Section */}
                <div className="md:col-span-2">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {/* Project Images Section */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold mb-4">Project Images</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {projectData.images?.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Project Image ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Project Details Section */}
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{projectData.projectName}</h2>
                            <p className="mb-4">{projectData.description}</p>
                            {freelancer && (
                                <>
                                    <h3 className="text-lg font-bold">Category:</h3>
                                    <p>{projectData.category}</p>
                                    <h3 className="text-lg font-bold">Subcategory:</h3>
                                    <p>{projectData.subcategory}</p>
                                    <h3 className="text-lg font-bold">Search Tags:</h3>
                                    <ul className="list-disc list-inside">
                                        {'searchTags' in projectData && projectData.searchTags.map((tag, index) => (
                                            <li key={index}>{tag}</li>
                                        ))}
                                    </ul>
                                    <h3 className="text-lg font-bold">Price:</h3>
                                    <p>${projectData.price}</p>
                                </>
                            )}
                            {client && (
                                <>
                                    <h3 className="text-lg font-bold">Skills Required:</h3>
                                    <ul className="list-disc list-inside">
                                        {'skills' in projectData && projectData.skills.map((skill, index) => (
                                            <li key={index}>{skill}</li>
                                        ))}
                                    </ul>
                                    <h3 className="text-lg font-bold">Budget:</h3>
                                    <p>
                                        ${'startBudget' in projectData && projectData.startBudget} - ${'endBudget' in projectData && projectData.endBudget}
                                    </p>
                                    <h3 className="text-lg font-bold">Key Points:</h3>
                                    <ul className="list-disc list-inside">
                                        {'keyPoints' in projectData && projectData.keyPoints.map((point, index) => (
                                            <li key={index}>{point}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Conditional Rendering for Client Details */}
                {!myProject && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {/* Client details section can be rendered here */}
                    </div>
                )}
                {myProject && <div className="bg-white shadow-md rounded-lg p-6"></div>}
            </div>
        </div>
        </>
    );
};

export default ProjectDetailsPage;
