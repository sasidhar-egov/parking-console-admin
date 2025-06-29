import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AdminNavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
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
`;

const AdminLogo = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
`;

const AdminNavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const AdminNavLink = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const AdminNavbar = ( props ) => {
    console.log(props.currentPage);
    const navigate=useNavigate()
  const navItems = [
    { key: 'home', label: 'Dashboard' },
    { key: 'slots', label: 'Slots' },
    { key: 'staff', label: 'Staff' },
    { key: 'users', label: 'Users' },
    { key: 'bookings', label: 'Bookings' }
  ];

  return (
    <AdminNavbarContainer>
      <AdminNavContent>
        <AdminLogo>Admin Console</AdminLogo>
        <AdminNavLinks>
          {navItems.map(item => (
            <AdminNavLink
              key={item.key}
              className={props.currentPage === item.key ? 'active' : ''}
              onClick={() => navigate(`/admin/${item.key}`)}
            >
              {item.label}
            </AdminNavLink>
          ))}
        </AdminNavLinks>
      </AdminNavContent>
    </AdminNavbarContainer>
  );
};

export default AdminNavbar;