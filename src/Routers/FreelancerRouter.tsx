import { Routes, Route } from "react-router-dom";
import NavbarDefault from "../layout/navabr/navabar";
import Store from "../store/store";
import PrivateRoute from "./ClientProtectedRoute";
import HomePage from "../pages/user/Home";
import CreateGig from "../pages/user/CreateGig";

const FreelancerRouter = () => {
    const User=Store((config)=>config.user)
    return (
        <>
        <NavbarDefault/>
        <Routes>
            <Route path="/creategig" element={User.role=='Freelancer'?<PrivateRoute element={CreateGig} isAuthRoute={false} />:<HomePage />}/>
        </Routes>
        </>
    );
}

export default FreelancerRouter;
