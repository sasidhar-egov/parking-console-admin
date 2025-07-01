




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StaffNavbarContainer,
  StaffNavContent,
  StaffTopRow,
  StaffLogoWrapper,
  StaffCustomerLogoIcon,
  StaffLogo,
  StaffNavLinks,
  StaffNavLink,
  MobileMenuButton,
  MenuLine,
  LogoutButton
} from '../../styles/StyledComponents';

const StaffNavBar = ({ currentPage }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: 'Dashboard' },
    { key: 'vehicle-entry', label: 'Vehicle Entry' },
    { key: 'vehicle-exit', label: 'Vehicle Exit' }
  ];

  const handleNavClick = (path) => {
    navigate(`/staff/${path}`);
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
    <StaffNavbarContainer>
      <StaffNavContent>
        <StaffTopRow>
          <StaffLogoWrapper>
            <StaffCustomerLogoIcon>P</StaffCustomerLogoIcon>
            <StaffLogo>ParkEase</StaffLogo>
          </StaffLogoWrapper>

          <MobileMenuButton onClick={toggleMobileMenu}>
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
            <MenuLine isOpen={isMobileMenuOpen} />
          </MobileMenuButton>
        </StaffTopRow>

        <StaffNavLinks isOpen={isMobileMenuOpen}>
          {navItems.map(item => (
            <StaffNavLink
              key={item.key}
              className={currentPage === item.key ? 'active' : ''}
              onClick={() => handleNavClick(item.key)}
            >
              {item.label}
            </StaffNavLink>
          ))}
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </StaffNavLinks>
      </StaffNavContent>
    </StaffNavbarContainer>
  );
};

export default StaffNavBar;