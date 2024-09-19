import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/login';
import AdminHome from '../pages/admin/Home';
import ManageUsers from '../pages/admin/manageUsers';
import NavbarDefault from "../layout/navbar/navbar";
import { NotFound } from '../components/404/404';
import ManageCategory from '../pages/admin/ManageCategory';
import UserPost from '../pages/admin/userPost';
import FreelancerGig from '../pages/admin/freelancerGig';
import Reports from '../pages/admin/reports';
const AdminRouter = () => {
    return (
        <>
        <NavbarDefault />
         <Routes>
         <Route path='*' element={<NotFound/>}/>
         <Route path='/login' element={<AdminLogin/>} />
         <Route path='/' element={<AdminHome/>} />
         <Route path='/manage-user' element={<ManageUsers/>}/>
         <Route path='manage-category' element={<ManageCategory/>}/>
         <Route path= '/userposts' element={<UserPost/>} />
         <Route path= '/freelancergigs' element={<FreelancerGig/>} />
         <Route path= '/manage-reports' element={<Reports/>} />
        </Routes>
        </>
    );
}

export default AdminRouter;
