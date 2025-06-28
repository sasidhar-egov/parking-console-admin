import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgetPassword';
import Register from './components/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/forget-password' element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<div>hiiii</div>} />
        <Routes path="/customer/*">
          <Route path="/home" element={<CustomerHome />} />
          <Route path="/orders" element={<CustomerOrders />} />
        </Routes>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
