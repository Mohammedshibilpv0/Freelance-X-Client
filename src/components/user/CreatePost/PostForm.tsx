import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import {validateProjectName,
  validateBudget,
  validateDeadline,
  validateSkills,
  validateDescription,
  validateKeyPoints
} from '../../../utility/Validator'

interface FormData {
  projectName: string;
  description: string;
  skills: string[];
  startBudget: string;
  endBudget: string;
  deadline: string;
  keyPoints: string[];
}
interface FormErrors {
  projectName?: string;
  description?: string;
  skills?: string;
  startBudget?: string;
  endBudget?: string;
  deadline?: string;
  keyPoints?: string;
}


interface PostFormProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  onNext: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ formData, onFormDataChange, onNext }) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  const handleSkillsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      e.preventDefault();
      onFormDataChange({ skills: [...formData.skills, e.currentTarget.value.trim()] });
      e.currentTarget.value = '';
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index);
    onFormDataChange({ skills: newSkills });
  };

  const handleKeyPointChange = (index: number, value: string) => {
    const newKeyPoints = [...formData.keyPoints];
    newKeyPoints[index] = value;
    onFormDataChange({ keyPoints: newKeyPoints });
  };

  const addKeyPoint = () => {
    onFormDataChange({ keyPoints: [...formData.keyPoints, ""] });
  };

  const removeKeyPoint = (index: number) => {
    const newKeyPoints = formData.keyPoints.filter((_, i) => i !== index);
    onFormDataChange({ keyPoints: newKeyPoints });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    newErrors.projectName = validateProjectName(formData.projectName);
    newErrors.description = validateDescription(formData.description);
    newErrors.skills = validateSkills(formData.skills);
    newErrors.startBudget = validateBudget(formData.startBudget, formData.endBudget);
    newErrors.deadline = validateDeadline(formData.deadline);
    newErrors.keyPoints = validateKeyPoints(formData.keyPoints);
  
    setErrors(newErrors);
    console.log(newErrors);
    
    return Object.values(newErrors).every(error => error === undefined);
  };
  
  

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); }}
      className="w-full mt-8 max-w-3xl mx-auto p-6 bg-slate-50 shadow-md rounded-lg"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectName">
          Project Name
        </label>
        <input
          type="text"
          name="projectName"
          id="projectName"
          value={formData.projectName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.projectName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter project name"
        />
        {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter project description"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
          Skill Requirements
        </label>
        <input
          type="text"
          name="skillsInput"
          id="skillsInput"
          onKeyDown={handleSkillsKeyDown}
          className={`w-full px-3 py-2 border ${errors.skills ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="Enter a skill and press Enter"
        />
        {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between p-2 border border-slate-200 rounded-md bg-white">
              <span>{skill}</span>
              <IoMdClose onClick={() => removeSkill(index)} className="text-lg cursor-pointer" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex mb-4">
        <div className="w-1/2 mr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startBudget">
            Start Budget
          </label>
          <input
            type="number"
            name="startBudget"
            id="startBudget"
            value={formData.startBudget}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.startBudget ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter start budget"
          />
        </div>

        <div className="w-1/2 ml-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endBudget">
            End Budget
          </label>
          <input
            type="number"
            name="endBudget"
            id="endBudget"
            value={formData.endBudget}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.startBudget ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter end budget"
          />
        </div>
      </div>
      {errors.startBudget && <p className="text-red-500 text-xs mt-1">{errors.startBudget}</p>}

      <div className="flex mb-4">
        <div className="w-1/2 mr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            id="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.deadline ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Key Points
        </label>
        {formData.keyPoints.map((point, index) => (
          <div key={index} className="mb-2 flex items-center">
            <input
              type="text"
              value={point}
              onChange={(e) => handleKeyPointChange(index, e.target.value)}
              className={`w-full px-3 py-2 border ${errors.keyPoints ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder={`Key point ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeKeyPoint(index)}
              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
            >
              Remove
            </button>
          </div>
        ))}
        {errors.keyPoints && <p className="text-red-500 text-xs mt-1">{errors.keyPoints}</p>}
        <button
          type="button"
          onClick={addKeyPoint}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Key Point
        </button>
      </div>

      <div className="text-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={handleSubmit}
          
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default PostForm;
