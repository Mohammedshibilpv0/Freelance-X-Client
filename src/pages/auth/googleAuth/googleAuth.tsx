import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../../api/user/AuthuserServices";
import Store from "../../../store/store";
import useShowToast from "../../../Custom Hook/showToaster";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
    const { setUser } = Store();
    const navigate=useNavigate()
    const Toast=useShowToast()
    const handleGoogle = async (userCredential:string|undefined) => {
        if(userCredential){
          const userData= await googleAuth(userCredential)
         if(userData.message){
            setUser(userData.userObject);
            Toast(userData.message,'success',true)
            setTimeout(() => navigate("/"), 1000);
         }
        }
      };
    return (
        <GoogleLogin
        onSuccess={(userData)=>handleGoogle(userData.credential)}
        onError={() => {
         Toast('Something went wrong please try again later','error',true)
        }}
      />
    );
}

export default GoogleAuth;
