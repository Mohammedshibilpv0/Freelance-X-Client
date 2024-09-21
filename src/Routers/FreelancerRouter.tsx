import { Routes, Route } from "react-router-dom";
import NavbarDefault from "../layout/navbar/navbar";
import Store from "../store/store";
import PrivateRoute from "./ClientProtectedRoute";
import HomePage from "../pages/user/Home";
import CreateGig from "../pages/user/CreateGig";
import EditGig from "../pages/user/EditGig";

const FreelancerRouter = () => {
    const User=Store((config)=>config.user)
    return (
        <>
        <NavbarDefault/>
        <Routes>
            <Route path="/creategig" element={User.role=='Freelancer'?<PrivateRoute element={CreateGig} isAuthRoute={false} />:<HomePage />}/>
            <Route path='/editproject/:id' element={User.role=='Freelancer'?<PrivateRoute element={EditGig} isAuthRoute={false} />:<HomePage />}/>
        </Routes>
        </>
    );
}

export default FreelancerRouter;
