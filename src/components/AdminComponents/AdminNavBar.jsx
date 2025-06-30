import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LogoutButton = styled.button`
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

const AdminNavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const AdminNavContent = styled.div`
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

const AdminTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  @media (min-width: 769px) {
    width: auto;
  }
`;

const AdminLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AdminLogo = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.4rem;
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const AdminCustomerLogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-weight: bold;
  font-size: 1.2rem;
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
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

const AdminNavLinks = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const AdminNavLink = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: left;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    
    &:hover {
      transform: translateX(4px);
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const AdminNavbar = ({ currentPage }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { key: 'home', label: 'Dashboard' },
    { key: 'slots', label: 'Slots' },
    { key: 'staff', label: 'Staff' },
    { key: 'users', label: 'Users' },
    { key: 'bookings', label: 'Bookings' }
  ];

  const handleNavClick = (path) => {
    navigate(`/admin/${path}`);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
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
    <AdminNavbarContainer>
      <AdminNavContent>
        <AdminTopRow>
          <AdminLogoWrapper>
            <AdminCustomerLogoIcon>P</AdminCustomerLogoIcon>
            <AdminLogo>Admin Console</AdminLogo>
          </AdminLogoWrapper>
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
          </MobileMenuButton>
        </AdminTopRow>
        
        <AdminNavLinks isOpen={isMobileMenuOpen}>
          {navItems.map(item => (
            <AdminNavLink
              key={item.key}
              className={currentPage === item.key ? 'active' : ''}
              onClick={() => handleNavClick(item.key)}
            >
              {item.label}
            </AdminNavLink>
          ))}
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </AdminNavLinks>
      </AdminNavContent>
    </AdminNavbarContainer>
  );
};

export default AdminNavbar;