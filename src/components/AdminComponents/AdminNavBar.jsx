import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminNavbarContainer,
  AdminNavContent,
  AdminTopRow,
  AdminLogoWrapper,
  AdminCustomerLogoIcon,
  AdminLogo,
  AdminNavLinks,
  AdminNavLink,
  MobileMenuButton,
  MenuLine,
  LogoutButton
} from '../../styles/StyledComponents';



const AdminNavbar = () => {
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