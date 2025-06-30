import { Navigate, Outlet } from 'react-router-dom';
import { UserName } from '../styles/StyledComponents';
import CustomerNavbarComponent from './CustomerComponents/CustomerNavbar';
import StaffNavbar from './StaffComponents/StaffNavBar';
import AdminNavbar from './AdminComponents/AdminNavBar';

const ProtectedRoute = ({ allowedRole }) => {
  const role = localStorage.getItem('role');
  console.log("object");

  if (!role || !localStorage.getItem("username")){
    return <Navigate to={`/`} replace />;
  }

  if ( role !== allowedRole) {
    return <Navigate to={`${role}/home`} replace />;
  }
  return (
    <>
      {allowedRole === "customer" && <CustomerNavbarComponent />}
      {allowedRole === "staff" && <StaffNavbar />}
      {allowedRole === "admin" && <AdminNavbar />}
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
