import { Routes, Route } from "react-router-dom";
import Register from "../pages/auth/register/register";
import Login from "../pages/auth/login/login";
import NavbarDefault from "../layout/navabr/navabar";
import PrivateRoute from "./ClientProtectedRoute";
import HomePage from "../pages/user/Home";
import Profile from "../pages/profile/profile";
import { NotFound } from "../components/404/404";
import ProjectDetailsPage from "../components/user/DetailProject/ProjectDetailsPage";
import Explore from "../pages/user/Explore";


const ClientRouter = () => {

  return (
    <>
      <NavbarDefault />
      <Routes>
      <Route path='*' element={<NotFound/>}/>
        <Route
          path="/register"
          element={<PrivateRoute element={Register} isAuthRoute={true} />}
        />
        <Route
          path="/login"
          element={<PrivateRoute element={Login} isAuthRoute={true} />}
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={ <PrivateRoute element={Profile} isAuthRoute={false} />} /> 
        <Route path="/projectdetail/:id" element={<PrivateRoute element={ProjectDetailsPage} isAuthRoute={false} />} />
        <Route path="/explore" element={<PrivateRoute element={Explore} isAuthRoute={false} />} />
      </Routes>
    </>
  );
};

export default ClientRouter;
