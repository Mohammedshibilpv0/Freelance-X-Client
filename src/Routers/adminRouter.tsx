import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/login';
import AdminHome from '../pages/admin/Home';
import ManageUsers from '../pages/admin/manageUsers';
import NavbarDefault from "../layout/navabr/navabar";
import { NotFound } from '../components/404/404';
import ManageCategory from '../pages/admin/ManageCategory';
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
        </Routes>
        </>
    );
}

export default AdminRouter;
