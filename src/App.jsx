// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
// import ForgotPassword from './components/ForgetPassword';
// import Register from './components/Register';
// import CustomerHome from './components/CustomerComponents/CustomerHome';
// import CustomerOrders from './components/CustomerComponents/CustomerOrders';
// import { db, clearAllData, initializeDummyData } from './data/db';
// import { useEffect } from 'react';
// import StaffDashboard from './components/StaffComponents/StaffHomepage';
// import VehicleEntry from './components/StaffComponents/VehicleEntry';
// import VehicleExit from './components/StaffComponents/VehicleExit';
// import AdminUsers from './components/AdminComponents/AdminUSers';
// import AdminBookings from './components/AdminComponents/AdminBookings';
// import AdminSlots from './components/AdminComponents/AdminSlots';
// import AdminHome from './components/AdminComponents/AdminHomepage';
// import AdminStaff from './components/AdminComponents/AdminStaff';

// const App = () => {
//   const fetchDummyData = async () => {
//     const userCount = await db.users.count();
//     console.log(userCount, "hii");
//     if (userCount === 0) {
//       clearAllData()
//       clearAllData("ftechded")
//       initializeDummyData()
//     }
//   }
//   useEffect(() => {
//     fetchDummyData()
//   }, [])
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path='/forget-password' element={<ForgotPassword />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/dashboard" element={<div>hiiii</div>} />
//         <Route path="/customer/*">
//           <Route path="home" element={<CustomerHome />} />
//           <Route path="orders" element={<CustomerOrders />} />
//         </Route>
//         <Route path="/staff/*">
//           <Route path="home" element={<StaffDashboard />} />
//           <Route path="vehicle-entry" element={<VehicleEntry />} />
//           <Route path="vehicle-exit" element={<VehicleExit />} />

//         </Route>
//         <Route path="/admin/*">
//           <Route path="home" element={<AdminHome />} />
//           <Route path="staff" element={<AdminStaff />} />
//           <Route path="slots" element={<AdminSlots />} />
//           <Route path="bookings" element={<AdminBookings />} />
//           <Route path="users" element={<AdminUsers />} />

//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;



import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ForgotPassword from './components/ForgetPassword';
import Register from './components/Register';
import CustomerHome from './components/CustomerComponents/CustomerHome';
import CustomerOrders from './components/CustomerComponents/CustomerOrders';
import StaffDashboard from './components/StaffComponents/StaffHomepage';
import VehicleEntry from './components/StaffComponents/VehicleEntry';
import VehicleExit from './components/StaffComponents/VehicleExit';
import AdminUsers from './components/AdminComponents/AdminUSers';
import AdminBookings from './components/AdminComponents/AdminBookings';
import AdminSlots from './components/AdminComponents/AdminSlots';
import AdminHome from './components/AdminComponents/AdminHomepage';
import AdminStaff from './components/AdminComponents/AdminStaff';
import ProtectedRoute from './components/ProtectedRoute';
import { db, clearAllData, initializeDummyData } from './data/db';
import { useEffect } from 'react';
import CommonNotFound from './components/CommonNotFound';
import NotFound from './components/NotFound';

const App = () => {
  const fetchDummyData = async () => {
    const userCount = await db.users.count();
    if (userCount === 0) {
      clearAllData();
      initializeDummyData();
    }
  };

  useEffect(() => {
    fetchDummyData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRole="customer" />}>
          <Route path="/customer">
            <Route path="home" element={<CustomerHome />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="*" element={<CommonNotFound />} />
          </Route>
        </Route>

        {/* Protected Staff Routes */}
        <Route element={<ProtectedRoute allowedRole="staff" />}>
          <Route path="/staff/*">
            <Route path="home" element={<StaffDashboard />} />
            <Route path="vehicle-entry" element={<VehicleEntry />} />
            <Route path="vehicle-exit" element={<VehicleExit />} />
            <Route path="*" element={<CommonNotFound />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin/*">
            <Route path="home" element={<AdminHome />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="slots" element={<AdminSlots />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<CommonNotFound />} />

          </Route>
          <Route path="*" element={<NotFound />} />

        </Route>

      
      </Routes>
    </BrowserRouter>
  );
};

export default App;
