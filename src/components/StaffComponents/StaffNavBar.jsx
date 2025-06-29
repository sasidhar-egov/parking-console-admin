import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const UserInfo = styled.div`
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StaffNavbar = (props) => {
  const navigate=useNavigate()
  return (
    <NavbarContainer>
      <NavContent>
        <Logo>🅿️ Parking Staff</Logo>
        
        <NavButtons>
          <NavButton 
            active={props.currentPage === 'vehicle-entry'} 
            onClick={() => navigate(`/staff/vehicle-entry`)}
          >
            Vehicle Entry
          </NavButton>
          <NavButton 
            active={props.currentPage === 'vehicle-exit'} 
            onClick={() => navigate(`/staff/vehicle-exit`)}
          >
            Vehicle Exit
          </NavButton>
          <NavButton 
            active={props.currentPage === 'home'} 
            onClick={() => navigate(`/staff/home`)}
          >
            Dashboard
          </NavButton>
        </NavButtons>

        <UserInfo>
          <span>👤 {localStorage.getItem("username")}</span>
          <NavButton onClick={() => window.location.reload()}>
            Logout
          </NavButton>
        </UserInfo>
      </NavContent>
    </NavbarContainer>
  );
};

export default StaffNavbar;