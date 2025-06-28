import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgetPassword';
import Register from './components/Register';
import CustomerHome from './components/CustomerComponents/CustomerHome';
import CustomerOrders from './components/CustomerComponents/CustomerOrders';
import { db, clearAllData, initializeDummyData } from './data/db';
import { useEffect } from 'react';

const App = () => {
  const fetchDummyData = async () => {
    const userCount = await db.users.count();
    console.log(userCount,"hii");
    if (userCount === 0) {
      clearAllData()
      clearAllData("ftechded")
      initializeDummyData()
    }
  }
  useEffect(() => {
    fetchDummyData()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/forget-password' element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<div>hiiii</div>} />
        <Route path="/customer/*">
          <Route path="home" element={<CustomerHome />} />
          <Route path="orders" element={<CustomerOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
