import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgetPassword';
import Register from './components/Register';
import CustomerHome from './components/CustomerComponents/CustomerHome';
import CustomerOrders from './components/CustomerComponents/CustomerOrders';
import { db, clearAllData, initializeDummyData } from './data/db';
import { useEffect } from 'react';
import StaffDashboard from './components/StaffComponents/StaffHomepage';
import VehicleEntry from './components/StaffComponents/VehicleEntry';
import VehicleExit from './components/StaffComponents/VehicleExit';
import AdminUsers from './components/AdminComponents/AdminUSers';
import AdminBookings from './components/AdminComponents/AdminBookings';
import AdminSlots from './components/AdminComponents/AdminSlots';
import AdminHome from './components/AdminComponents/AdminHomepage';
import AdminStaff from './components/AdminComponents/AdminStaff';

const App = () => {
  const fetchDummyData = async () => {
    const userCount = await db.users.count();
    console.log(userCount, "hii");
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
        <Route path="/staff/*">
          <Route path="home" element={<StaffDashboard />} />
          <Route path="VehicleEntry" element={<VehicleEntry />} />
          <Route path="VehicleExit" element={<VehicleExit />} />

        </Route>
        <Route path="/admin/*">
          <Route path="home" element={<AdminHome />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="slots" element={<AdminSlots />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
