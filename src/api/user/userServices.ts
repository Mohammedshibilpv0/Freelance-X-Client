import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { FormData } from "../../pages/user/CreatePost";
import { FormValues } from "../../pages/user/CreateGig";

interface PostImageResponse {
  data: {
      url: string;
  };
}

export const editUserProfile = async (Data: object) => {
  try {
    const response = await axiosInstance.post("/user/editprofile", { Data });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const editProfileImage = async (formData: object) => {
  try {
    const response = await axiosInstance.post(
      "/user/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const switchUserRole=async(action:string,email:string)=>{
  try{
    const response=await axiosInstance.put(`/user/switchuserrole`,{action,email})
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const fetchSubcategories =async (categoryId:string)=>{
  try{
    const response=await axiosInstance.get(`/user/subcategories/${categoryId}`)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}



export const postImage = async (data: object): Promise<PostImageResponse> => {
  try {
      console.log(data);
      const response = await axiosInstance.post<PostImageResponse>('/client/upload', data, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response.data;
  } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response && axiosError.response.data) {
          return axiosError.response.data as PostImageResponse;
      } else {
          throw new Error('An unexpected error occurred.');
      }
  }
};

export const createClientPost= async (formData:FormData,email:string)=>{
  try{    
    const response= await axiosInstance.post('/client/createclientpost',{formData,email})
    console.log(response)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
    
  }
}

export const createGig = async (formData:FormValues,email:string)=>{
  try{
    const response= await axiosInstance.post('/freelancer/createGig',{formData,email})
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const freelancerWork = async(email:string,page:number,limit:number)=>{
  try{
    const response= await axiosInstance.get(`/freelancer/getfreelancerwork/${email}`,{
      params: {
        page,
        limit
      }
    })
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
    
  }
}

export const fetchClientData= async (email:string,page:number,limit:number)=>{
  try{
    const response= await axiosInstance.get(`/client/getuserspost/${email}`,{
      params: {
        page,
        limit
      }
    })
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const getFreelancerWorkById = async (id:string|undefined)=>{
  try{
    const response=await axiosInstance.get(`/freelancer/gig/${id}`)
        return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const getClientPostById= async(id:string|undefined)=>{
  try{
    const response = await axiosInstance.get(`/client/post/${id}`)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const posts= async(page:number=1,limit:number=2)=>{
  try{
    const response=await axiosInstance.get('/client/posts',{
      params: {
        page,
        limit
      }
    })
    return response.data

  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const gigs = async (page:number=1,limit:number=2)=>{
  try{
    const response=await axiosInstance.get('/freelancer/gig',{
      params: {
        page,
        limit
      }
    })
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}


export const findUser= async(id:string)=>{
  try{
    const response=await axiosInstance.get(`/user/user/${id}`)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}
