import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import NavbarDefault from "../layout/navabr/navabar";
import PrivateRoute from "./ClientProtectedRoute";
import CreatePost from "../pages/user/CreatePost";
import Store from "../store/store";
import HomePage from "../pages/user/Home";

const ClientRouter = () => {
    const navigate=useNavigate()
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
