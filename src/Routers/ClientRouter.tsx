import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NavbarDefault from "../layout/navbar/navbar";
import PrivateRoute from "./ClientProtectedRoute";
import CreatePost from "../pages/user/CreatePost";
import Store from "../store/store";

const ClientRouter = () => {
    const User=Store((config)=>config.user)
    return (
      <> 
       <NavbarDefault />  
        <Routes>
        <Route path="/createpost" element={User.role=='Client'?<PrivateRoute element={CreatePost} isAuthRoute={false} />: <Navigate to="/" replace />} /> 
        </Routes>
        </>
        
    );
}

export default ClientRouter;
