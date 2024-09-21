// ProtectedRoute.js
import { Navigate } from 'react-router-dom'; 
import useAdminStore from '../store/adminStore'; 

interface prop {
    children :any
}
const AdminProtectedRoute:React.FC<prop> = ({ children }) => {
  const adminEmail = useAdminStore((state) => state.adminEmail);

  
  if (!adminEmail) {

    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
