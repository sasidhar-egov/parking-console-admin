import React, { useState } from 'react';
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  @media (min-width: 769px) {
    width: auto;
  }
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

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
`;

const MenuLine = styled.div`
  width: 20px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
  
  ${props => props.isOpen && `
    &:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    &:nth-child(2) {
      opacity: 0;
    }
    &:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  `}
`;

const NavButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    gap: 0.75rem;
  }
`;

const NavButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.25)' : 'transparent'};
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.5);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    width: 100%;
    border-radius: 8px;
    
    &:hover {
      transform: translateX(4px);
    }
  }
`;

const UserInfo = styled.div`
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 1rem;
  }
`;

const UserName = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const LogoutButton = styled(NavButton)`
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  
  &:hover {
    background: rgba(255, 107, 107, 0.3);
    border-color: rgba(255, 107, 107, 0.6);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StaffNavbar = (props) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { key: 'home', label: 'Dashboard', path: '/staff/home' },
    { key: 'vehicle-entry', label: 'Vehicle Entry', path: '/staff/vehicle-entry' },
    { key: 'vehicle-exit', label: 'Vehicle Exit', path: '/staff/vehicle-exit' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

    const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("role")
    navigate("/")
  };


  return (
    <NavbarContainer>
      <NavContent>
        <TopRow>
          <CustomerLogo onClick={() => navigate("/staff/home")}>
            <CustomerLogoIcon>P</CustomerLogoIcon>
            ParkEase
          </CustomerLogo>
          
          <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle menu">
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
          </MobileMenuButton>
        </TopRow>
        
        <NavButtons isOpen={isMobileMenuOpen}>
          {navItems.map(item => (
            <NavButton
              key={item.key}
              active={props.currentPage === item.key}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
            </NavButton>
          ))}
        </NavButtons>
        
        <UserInfo>
          <UserName>
            👤 {localStorage.getItem("username") || "Staff User"}
          </UserName>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </UserInfo>
      </NavContent>
    </NavbarContainer>
  );
};

export default StaffNavbar;