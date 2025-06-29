import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db';
import AdminNavbar from './AdminNavBar';

const AdminUsersContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminTitle = styled.h2`
  color: #667eea;
  margin-bottom: 2rem;
`;

const AdminUsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AdminUserCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const AdminUserName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-size: 1.3rem;
`;

const AdminUserInfo = styled.div`
  color: #6c757d;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdminUserLabel = styled.span`
  font-weight: 500;
  min-width: 80px;
`;

const AdminRoleBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => props.role === 'admin' ? '#dc3545' : '#28a745'};
  color: white;
`;

const AdminDeleteButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: #dc3545;
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    background: #c82333;
  }
`;

const AdminSearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const AdminSearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const AdminFilterButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const AdminFilterButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e9ecef'};
  }
`;

const AdminEmptyState = styled.div`
  text-align: center;
  color: #6c757d;
  padding: 3rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const initialState = {
  users: [],
  filteredUsers: [],
  loading: true,
  error: null,
  searchTerm: '',
  roleFilter: 'all'
};

const adminUsersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
        filteredUsers: action.payload,
        loading: false
      };
    case 'DELETE_USER':
      const updatedUsers = state.users.filter(user => user.id !== action.payload);
      return {
        ...state,
        users: updatedUsers,
        filteredUsers: updatedUsers.filter(user =>
          filterUser(user, state.searchTerm, state.roleFilter)
        )
      };
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
        filteredUsers: state.users.filter(user =>
          filterUser(user, action.payload, state.roleFilter)
        )
      };
    case 'SET_ROLE_FILTER':
      return {
        ...state,
        roleFilter: action.payload,
        filteredUsers: state.users.filter(user =>
          filterUser(user, state.searchTerm, action.payload)
        )
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const filterUser = (user, searchTerm, roleFilter) => {
  const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm);

  const matchesRole = roleFilter === 'all' || user.role === roleFilter;

  return matchesSearch && matchesRole;
};

const AdminUsers = () => {
  const [state, dispatch] = useReducer(adminUsersReducer, initialState);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const users = await db.users.toArray();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const handleDeleteUser = async (userId, userRole) => {
    if (userRole === 'admin') {
      alert('Cannot delete admin users!');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      // Also delete user's bookings
      await db.bookings.where('userName').equals(userId).delete();
      await db.users.delete(userId);
      dispatch({ type: 'DELETE_USER', payload: userId });
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  const handleSearchChange = (e) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  };

  const handleRoleFilter = (role) => {
    dispatch({ type: 'SET_ROLE_FILTER', payload: role });
  };

  if (state.loading) {
    return (
      <>
        <AdminNavbar currentPage="users" />
        <AdminUsersContainer>
          <AdminTitle>Loading Users...</AdminTitle>
        </AdminUsersContainer>
      </>
    );
  }

  return (
    <>
      <AdminNavbar currentPage="users" />
      <AdminUsersContainer>
        <AdminTitle>User Management</AdminTitle>

        <AdminSearchContainer>
          <AdminSearchInput
            type="text"
            placeholder="Search users by name, username, or phone..."
            value={state.searchTerm}
            onChange={handleSearchChange}
          />
          <AdminFilterButtons>
            <AdminFilterButton
              active={state.roleFilter === 'all'}
              onClick={() => handleRoleFilter('all')}
            >
              All Users
            </AdminFilterButton>
            <AdminFilterButton
              active={state.roleFilter === 'customer'}
              onClick={() => handleRoleFilter('customer')}
            >
              Regular Users
            </AdminFilterButton>
            <AdminFilterButton
              active={state.roleFilter === 'staff'}
              onClick={() => handleRoleFilter('staff')}
            >
              Staff
            </AdminFilterButton>
            <AdminFilterButton
              active={state.roleFilter === 'admin'}
              onClick={() => handleRoleFilter('admin')}
            >
              Admins
            </AdminFilterButton>
          </AdminFilterButtons>
        </AdminSearchContainer>

        {state.filteredUsers.length === 0 ? (
          <AdminEmptyState>
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </AdminEmptyState>
        ) : (
          <AdminUsersGrid>
            {state.filteredUsers.map(user => (
              <AdminUserCard key={user.id}>
                {user.role !== 'admin' && (
                  <AdminDeleteButton onClick={() => handleDeleteUser(user.id, user.role)}>
                    ×
                  </AdminDeleteButton>
                )}
                <AdminUserName>{user.name}</AdminUserName>
                <AdminUserInfo>
                  <AdminUserLabel>Username:</AdminUserLabel>
                  <span>{user.username}</span>
                </AdminUserInfo>
                <AdminUserInfo>
                  <AdminUserLabel>Phone:</AdminUserLabel>
                  <span>{user.phone}</span>
                </AdminUserInfo>
                <AdminUserInfo>
                  <AdminUserLabel>Role:</AdminUserLabel>
                  <AdminRoleBadge role={user.role}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </AdminRoleBadge>
                </AdminUserInfo>
              </AdminUserCard>
            ))}
          </AdminUsersGrid>
        )}
      </AdminUsersContainer>
    </>
  );
};

export default AdminUsers;