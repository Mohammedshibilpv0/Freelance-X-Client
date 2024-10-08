import { AxiosError } from "axios";
import axiosInstance from "../adminAxios";

export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/login", {
      email,
      password,
    });
    const { accessToken, refreshToken } = response.data;
    if (accessToken && refreshToken) {
      localStorage.setItem("AdminAccessToken", accessToken);
      localStorage.setItem("AdminRefreshToken", refreshToken);
    }
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response && error.response.data) {
      return { error: error.response.data };
    } else {
      return { error: "An unexpected error occurred" };
    }
  }
};

export const fetchUsers = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (err) {
    return { error: "An unexpected error occurred" };
  }
};

export const manageUser = async (action: string, email: string) => {
  try {
    const response = await axiosInstance.put("/admin/updateUserBlockStatus/", {
      action,
      email,
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};


export const addCategory= async(formData:FormData)=>{
    try{
        const response= await axiosInstance.post('/admin/category',formData,{
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
        )      
        return response.data
    }catch(err){
      const axiosError = err as AxiosError;
      if (axiosError.response) {        
        console.log('Error response:', axiosError.response.data);
        return axiosError.response.data;
      }
      throw axiosError;
    }
}

export const fetchCategory= async(page: number, limit: number)=>{
  try{
    const response=await axiosInstance.get(`/admin/categories?page=${page}&limit=${limit}`)
    return response.data
  
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
    
  }
}

export const fetchCategoryById=async(categoryid:string|undefined|null)=>{
  try{
    
    const response=await axiosInstance.get(`/admin/findcategory/${categoryid}`)
    return response.data
  }catch(err){
    console.log(err);
    
  }
}



export const updateCategory= async(categoryId:string,formData:FormData)=>{
  try{

    const response=await axiosInstance.put(`/admin/category/${categoryId}`,formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
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


export const deleteCategory=async(categorId:string)=>{
  try{

    const response=await axiosInstance.put(`/admin/deletecategory/${categorId}`)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}


export const addSubCategory = async(name:string, description:string, category:string)=>{
  try{
    const response=await axiosInstance.post('/admin/subcategory',{name,description,category})
    console.log(response);
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const getSubCategories=async(page: number, limit: number)=>{
  try{
    const response=await axiosInstance.get(`/admin/subcategories?page=${page}&limit=${limit}`)
    return response.data
    
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const fetchsubCategoryById = async(subcategoryId:string)=>{
  try{
    const response=await axiosInstance.get(`/admin/findsubcategory/${subcategoryId}`)
    return response.data

  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const updateSubCategory = async(subcategoryId:string,name:string,description:string,category:string)=>{
  try{
    const response=await axiosInstance.put('/admin/subcategory',{subcategoryId,name,description,category})
    return response.data


  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
  }
}


export const deleteSubCategory = async(subCategoryId:string)=>{
  try{
    const response=await axiosInstance.put(`/admin/deletesubcategory/${subCategoryId}`)
    console.log(response);
    
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
  }
}

export const getUserPosts = async(page:number,limit:number)=>{
   try{
    const response = await axiosInstance.get(`/admin/userposts?page=${page}&limit=${limit}`)
    return response.data
   }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
   }
}

export const getFreelancerGigs = async(page:number,limit:number)=>{
  try{
   const response = await axiosInstance.get(`/admin/freelancerGig?page=${page}&limit=${limit}`)
   return response.data
  }catch(err){
   const axiosError = err as AxiosError;
   if (axiosError.response) {
     return axiosError.response.data;
   } 
  }
}

export const updateBlockStatus = async (postId: string, isBlock: boolean) => {
  const response = await axiosInstance.patch(`/admin/user-posts/block/${postId}`, {
    isBlock: isBlock,
  });
  return response.data;
};

export const updateBlockStatusFreelancer = async (postId: string, isBlock: boolean) => {
  const response = await axiosInstance.patch(`/admin/freelancer-gig/block/${postId}`, {
    isBlock: isBlock,
  });
  return response.data;
};

export const reports = async(page:number,limit:number)=>{
  try{
   const response = await axiosInstance.get(`/admin/reports?page=${page}&limit=${limit}`)
   return response.data
  }catch(err){
   const axiosError = err as AxiosError;
   if (axiosError.response) {
     return axiosError.response.data;
   } 
  }
}


export const dashboard=async()=>{
  try{
    const response= await axiosInstance.get('/admin/dashboard')
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    } 
   
  }
}