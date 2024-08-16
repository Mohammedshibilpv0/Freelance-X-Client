import UserRouter from './Routers/UserRouter';
import {Routes,Route} from 'react-router-dom'
import 'toastr/build/toastr.min.css';
import './style/toastr-custom.css';
import './index.css'
import AdminRouter from './Routers/adminRouter';
import ClientRouter from './Routers/ClientRouter';
import FreelancerRouter from './Routers/FreelancerRouter';
const App = () => {

  return (

    <Routes>
    <Route path="/*" element={<UserRouter/>}/>
    <Route path="/client/*" element ={<ClientRouter/>}/>
    <Route path='/admin/*' element={<AdminRouter/>}/>
    <Route path='/freelancer/*' element={<FreelancerRouter/>}/>
    </Routes>
    
  )
}
export default App;
