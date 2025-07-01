

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  CustomerNavbarContainer,
  CustomerNavContent,
  CustomerTopRow,
  CustomerLogoWrapper,
  CustomerCustomerLogoIcon,
  CustomerLogo,
  MobileMenuButton,
  MenuLine,
  CustomerNavLinks,
  CustomerNavLink,
  LogoutButton
} from '../../styles/StyledComponents';


const CustomerNavBar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'orders', label: 'orders' },
    
  ];

  const handleNavClick = (path) => {
    navigate(`/customer/${path}`);
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
    <CustomerNavbarContainer>
      <CustomerNavContent>
        <CustomerTopRow>
          <CustomerLogoWrapper>
            <CustomerCustomerLogoIcon>P</CustomerCustomerLogoIcon>
            <CustomerLogo>ParkEase</CustomerLogo>
          </CustomerLogoWrapper>

          <MobileMenuButton onClick={toggleMobileMenu}>
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
          </MobileMenuButton>
        </CustomerTopRow>

        <CustomerNavLinks isOpen={isMobileMenuOpen}>
          {navItems.map(item => (
            <CustomerNavLink
              key={item.key}
              onClick={() => handleNavClick(item.key)}
            >
              {item.label}
            </CustomerNavLink>
          ))}
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </CustomerNavLinks>
      </CustomerNavContent>
    </CustomerNavbarContainer>
  );
};

export default CustomerNavBar;