import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const CustomerNavbar = () => {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo>🚗 Parking System</Logo>
        
        <NavLinks>
          <NavLink to="/customer/home">Home</NavLink>
          <NavLink to="/customer/orders">My Orders</NavLink>
        </NavLinks>
        
        <UserInfo>
          <UserName>Welcome, {authUser?.name}</UserName>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </UserInfo>
      </NavContent>
    </NavbarContainer>
  );
};

export default CustomerNavbar;