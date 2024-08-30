import { AxiosError } from "axios";
import axiosInstance from "../axios";
import { FormData } from "../../pages/user/CreatePost";
import { FormValues } from "../../pages/user/CreateGig";
import { IProject, projectModule } from "../../components/user/DetailProject/ProjectDetailsPage";

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
  }
};

export const editProfileImage = async (formData: object) => {
  try {
    const response = await axiosInstance.post("/user/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const switchUserRole = async (action: string, email: string) => {
  try {
    const response = await axiosInstance.put(`/user/switchuserrole`, {
      action,
      email,
    });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const fetchSubcategories = async (categoryId: string) => {
  try {
    const response = await axiosInstance.get(
      `/user/subcategories/${categoryId}`
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const postImage = async (data: object): Promise<PostImageResponse> => {
  try {
    const response = await axiosInstance.post<PostImageResponse>(
      "/client/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response && axiosError.response.data) {
      return axiosError.response.data as PostImageResponse;
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const createClientPost = async (formData: FormData, email: string) => {
  try {
    const response = await axiosInstance.post("/client/createclientpost", {
      formData,
      email,
    });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const createGig = async (formData: FormValues, email: string) => {
  try {
    const response = await axiosInstance.post("/freelancer/createGig", {
      formData,
      email,
    });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const freelancerWork = async (
  email: string,
  page: number,
  limit: number
) => {
  try {
    const response = await axiosInstance.get(
      `/freelancer/getfreelancerwork/${email}`,
      {
        params: {
          page,
          limit,
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

export const fetchClientData = async (
  email: string,
  page: number,
  limit: number
) => {
  try {
    const response = await axiosInstance.get(`/client/getuserspost/${email}`, {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const getFreelancerWorkById = async (id: string | undefined,request:boolean=false) => {
  try {
    const response = await axiosInstance.get(`/freelancer/gig/${id}?request=${request}`);
    console.log(response)
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const getClientPostById = async (id: string | undefined,request:boolean=false) => {
  try {
    const response = await axiosInstance.get(`/client/post/${id}?request=${request}`);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const posts = async (page: number = 1, limit: number = 2) => {
  try {
    const response = await axiosInstance.get("/client/posts", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const gigs = async (page: number = 1, limit: number = 2) => {
  try {
    const response = await axiosInstance.get("/freelancer/gig", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const findUser = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/user/user/${id}`);
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const requstingProject = async (
  email: string,
  id: string,
  message: string,
  price: string,
  role: string
) => {
  try {
    const changedrole = role == "Client" ? "freelancer" : "client";
    const response = await axiosInstance.post(
      `/${changedrole}/requestproject`,
      { email, id, message, price, role }
    );
    return response.data
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};



export const changeStatus = async(id:string,role:string,status:string)=>{
  try{
    const response=await axiosInstance.put(`/${role.toLocaleLowerCase()}/projectstatus/${id}/${status}`)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const fetchCategory = async ()=>{
  try{
    const response= await axiosInstance.get('/user/categories')
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const findMyFriends= async(id:string)=>{
  try{
    const response= await axiosInstance.get(`/user/findmyfriends/${id}`)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const getMessage = async (conversationId:string)=>{
  try{
    const response= await axiosInstance.get(`/user/messages/${conversationId}`)
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const sendInitailMessage = async (senderId:string,userId:string,projectId:string)=>{
  try{
    const response= await axiosInstance.post(`/user/sendmessages/`,{senderId,userId,projectId})
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const findClientRequests = async( email: string,page: number,limit: number)=>{
  try{
    const response= await axiosInstance.get(`/client/myrequests/${email}`,{
      params: {
        page,
        limit,
      },
    })
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const findFreelancerRequests = async( email: string,page: number,limit: number)=>{
  try{
    const response= await axiosInstance.get(`/freelancer/myrequests/${email}`,{
      params: {
        page,
        limit,
      },
    })
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const findFreelancerApprovedProjects = async( email: string,page: number,limit: number)=>{
  try{
    const response= await axiosInstance.get(`/freelancer/approved/${email}`,{
      params: {
        page,
        limit,
      },
    })
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}
export const findClientApprovedProjects = async( email: string,page: number,limit: number)=>{
  try{
    const response= await axiosInstance.get(`/client/approved/${email}`,{
      params: {
        page,
        limit,
      },
    })
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}

export const setModuleClientPost = async (id:string,data:any) => {
  try {
    const response = await axiosInstance.put(`/freelancer/clientmodule/${id}`,{data});
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};

export const setModuleFreelancerPost = async (id:string,data:any) => {
  try {
    const response = await axiosInstance.put(`/freelancer/freelancermodule/${id}`,{data});
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
};


export const makePayemnt =async(data:projectModule,projectData:IProject)=>{
  try{
    const response = await axiosInstance.post('/client/create-checkout',{data,projectData})
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}
export const paymentSuccess =async(token:string,id:string,amount:string,isPost:string)=>{
  try{
    const response = await axiosInstance.post(`/client/successpayment/${token}`,{id,amount,isPost})
    return response.data
  }catch(err){
    const axiosError = err as AxiosError;
    if (axiosError.response) {
      return axiosError.response.data;
    }
  }
}