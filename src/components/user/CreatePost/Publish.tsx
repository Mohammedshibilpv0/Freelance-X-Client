import React, { useState } from "react";
import Carousal from "../Carousal/Carousal";
import { createClientPost,createGig } from "../../../api/user/userServices";
import { FormData as PostData } from "../../../pages/user/CreatePost";
import { FormValues as GigData } from "../../../pages/user/CreateGig";
import useShowToast from "../../../Custom Hook/showToaster";
import { useNavigate } from "react-router-dom";
import Store from "../../../store/store";
import Loading from "../../../style/loading";

interface PublishProps {
  data: PostData | GigData;
  categories: { _id: string; name: string }[] | string;
  subcategories: { _id: string; name: string }[] | string;
  onPrev: () => void;
  type: "post" | "gig";
}

const Publish: React.FC<PublishProps> = ({
  data,
  categories,
  subcategories,
  onPrev,
  type,
}) => {
  const email = Store((config) => config.user.email);
  const [loading,setLoading]=useState<boolean>(false)
  const getCategoryName = () => {
    if (typeof categories === "string") {
      return categories;
    }
    const category = (categories as { _id: string; name: string }[]).find(
      (cat) => cat._id === (data as PostData).category
    ) || { name: "Unknown" };
    return category.name;
  };
  const Toster = useShowToast();
  const navigate = useNavigate();
  const getSubcategoryName = () => {
    if (typeof subcategories === "string") {
      return subcategories;
    }
    const subcategory = (subcategories as { _id: string; name: string }[]).find(
      (sub) => sub._id === (data as PostData).subcategory
    ) || { name: "Unknown" };
    return subcategory.name;
  };

  const handlePublish = async () => {
    try {
      setLoading(true)
      if (type === "post") {
        const response = await createClientPost(data as PostData, email);
        if (response.message === "successfully post added") {
          setLoading(false)
          Toster(response.message, "success", true);
          navigate("/profile");
        }
      } else if (type === "gig") {
        const response = await createGig(data as GigData,email);
        if (response.message === "successfully post added") {
          setLoading(false)
          Toster(response.message, "success", true);
          navigate("/profile");
        }
      }
    } catch (err) {
      console.error("Error publishing:", err);
      setLoading(false)
    }
  };

  return (
    <div className="w-full mt-8 max-w-3xl mx-auto p-6 bg-slate-50 shadow-md rounded-lg">
      <Carousal
        data={{ images: (data as PostData).images || (data as GigData).images }}
      />
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Project Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="font-semibold text-gray-700">Project Name:</p>
            <p className="text-gray-900">
              {(data as PostData).projectName || (data as GigData).projectName}
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-700">Description:</p>
            <p className="text-gray-900">
              {(data as PostData).description || (data as GigData).description}
            </p>
          </div>
          {type === "post" && (
            <>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Skills Required:</p>
                <p className="text-gray-900">
                  {(data as PostData).skills.join(", ")}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Start Budget:</p>
                <p className="text-gray-900">
                  {(data as PostData).startBudget}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">End Budget:</p>
                <p className="text-gray-900">{(data as PostData).endBudget}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Deadline:</p>
                <p className="text-gray-900">{(data as PostData).deadline}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Key Points:</p>
                <ul className="list-disc list-inside text-gray-900">
                  {(data as PostData).keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {type === "gig" && (
            <>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Price:</p>
                <p className="text-gray-900">
                  {(data as GigData).price}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Deadline:</p>
                <p className="text-gray-900">
                  {(data as GigData).deadline}
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700">Search Tags:</p>
                <p className="text-gray-900">
                  {(data as GigData).searchTags.join(", ")}
                </p>
              </div>
            </>
          )}
          <div className="space-y-2">
            <p className="font-semibold text-gray-700">Category:</p>
            <p className="text-gray-900">{getCategoryName()}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-gray-700">Subcategory:</p>
            <p className="text-gray-900">{getSubcategoryName()}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrev}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={!loading ? handlePublish : undefined}
        >
        {loading?<Loading/>:'Submit'}
        </button>
      </div>
    </div>
  );
};

export default Publish;
