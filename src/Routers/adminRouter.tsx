// AdminRouter.js
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
import AdminProtectedRoute from './adminProtectedRoute';
const AdminRouter = () => {
  return (
    <>
      <NavbarDefault />
      <Routes>
        <Route path='*' element={<NotFound />} />
        
        {/* Public Route */}
        <Route path='/login' element={<AdminLogin />} />

        {/* Protected Routes */}
        <Route 
          path='/' 
          element={
            <AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path='/manage-user' 
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path='/manage-category' 
          element={
            <AdminProtectedRoute>
              <ManageCategory />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path='/userposts' 
          element={
            <AdminProtectedRoute>
              <UserPost />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path='/freelancergigs' 
          element={
            <AdminProtectedRoute>
              <FreelancerGig />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path='/manage-reports' 
          element={
            <AdminProtectedRoute>
              <Reports />
            </AdminProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default AdminRouter;
