import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CustomerNavbar = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CustomerNavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CustomerLogo = styled.div`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CustomerLogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-weight: bold;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
`;

const CustomerNavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CustomerNavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    padding: 0.75rem 1rem;
  }
`;

const CustomerUserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }
`;

const CustomerUserName = styled.span`
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CustomerLogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
  }
`;

const CustomerMobileToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CustomerNavbarComponent = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    // You can add navigation to login page or clear user data
  };

  return (
    <CustomerNavbar>
      <CustomerNavContainer>
        <CustomerLogo onClick={() => navigate("/customer/home")}>
          <CustomerLogoIcon>P</CustomerLogoIcon>
          ParkEase
        </CustomerLogo>

        <CustomerMobileToggle onClick={toggleMobileMenu}>
          {isOpen ? '✕' : '☰'}
        </CustomerMobileToggle>

        <CustomerNavLinks isOpen={isOpen}>
          <CustomerNavLink onClick={() => navigate("/customer/home")}>
            Home
          </CustomerNavLink>
          <CustomerNavLink onClick={() => navigate("/customer/orders")}>
            My Orders
          </CustomerNavLink>
        </CustomerNavLinks>

        <CustomerUserSection isOpen={isOpen}>
          <CustomerUserName>Welcome, {localStorage.getItem("username")}</CustomerUserName>
          <CustomerLogoutButton onClick={handleLogout}>
            Logout
          </CustomerLogoutButton>
        </CustomerUserSection>
      </CustomerNavContainer>
    </CustomerNavbar>
  );
};

export default CustomerNavbarComponent;