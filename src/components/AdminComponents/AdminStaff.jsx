import React, { useReducer, useEffect, useState } from 'react';
import { db } from '../../data/db';
import AdminNavbar from './AdminNavBar';

import {
  AdminStaffContainer,
  AdminHeader,
  AdminTitle,
  AdminButton,
  AdminStaffGrid,
  AdminStaffCard,
  AdminDeleteButton,
  AdminStaffName,
  AdminStaffInfo,
  AdminStaffLabel,
  AdminModal,
  AdminModalContent,
  AdminModalTitle,
  AdminInput,
  AdminModalButtons,
  AdminCancelButton
} from '../../styles/StyledComponents';
import { hashPassword } from '../../utils/passwordEncryption';

const initialState = {
  staff: [],
  loading: true,
  error: null
};

const adminStaffReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_STAFF':
      return { ...state, staff: action.payload, loading: false };
    case 'ADD_STAFF':
      return { ...state, staff: [...state.staff, action.payload] };
    case 'DELETE_STAFF':
      return {
        ...state,
        staff: state.staff.filter(member => member.id !== action.payload)
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const AdminStaff = () => {
  const [state, dispatch] = useReducer(adminStaffReducer, initialState);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    password: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const users = await db.users.where('role').equals('staff').toArray();
      dispatch({ type: 'SET_STAFF', payload: users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const handleAddStaff = async () => {
    const { name, username, phone, password } = formData;

    if (!name || !username || !phone || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const existingUser = await db.users.where('username').equals(username).first();
      if (existingUser) {
        alert('Username already exists!');
        return;
      }
      console.log("hiiiii");
      console.log(await hashPassword(formData.password));
      const newStaff = {
        ...formData,
        role: 'staff',
        password:await hashPassword(formData.password)
      };
      
      const id = await db.users.add(newStaff);
      dispatch({ type: 'ADD_STAFF', payload: { ...newStaff, id } });
      setShowAddModal(false);
      setFormData({ name: '', username: '', phone: '', password: '' });
    } catch (error) {
      alert('Error adding staff: ' + error.message);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    try {
      await db.users.delete(staffId);
      dispatch({ type: 'DELETE_STAFF', payload: staffId });
    } catch (error) {
      alert('Error deleting staff: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (state.loading) {
    return (
      <>
        <AdminStaffContainer>
          <AdminTitle>Loading Staff...</AdminTitle>
        </AdminStaffContainer>
      </>
    );
  }

  return (
    <>
      <AdminStaffContainer>
        <AdminHeader>
          <AdminTitle>Staff Management</AdminTitle>
          <AdminButton onClick={() => setShowAddModal(true)}>
            Add New Staff
          </AdminButton>
        </AdminHeader>

        <AdminStaffGrid>
          {state.staff.length === 0 ? (
            <AdminTitle>No staff members found.</AdminTitle>
          ) : (
            state.staff.map(member => (
              <AdminStaffCard key={member.id}>
                <AdminDeleteButton onClick={() => handleDeleteStaff(member.id)}>
                  ×
                </AdminDeleteButton>
                <AdminStaffName>{member.name}</AdminStaffName>
                <AdminStaffInfo>
                  <AdminStaffLabel>Username:</AdminStaffLabel>
                  <span>{member.username}</span>
                </AdminStaffInfo>
                <AdminStaffInfo>
                  <AdminStaffLabel>Phone:</AdminStaffLabel>
                  <span>{member.phone}</span>
                </AdminStaffInfo>
                <AdminStaffInfo>
                  <AdminStaffLabel>Role:</AdminStaffLabel>
                  <span>Staff</span>
                </AdminStaffInfo>
              </AdminStaffCard>
            ))
          )}
        </AdminStaffGrid>

        {showAddModal && (
          <AdminModal>
            <AdminModalContent>
              <AdminModalTitle>Add New Staff Member</AdminModalTitle>
              <AdminInput
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <AdminInput
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
              />
              <AdminInput
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <AdminInput
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <AdminModalButtons>
                <AdminCancelButton onClick={() => setShowAddModal(false)}>
                  Cancel
                </AdminCancelButton>
                <AdminButton onClick={handleAddStaff}>
                  Add Staff
                </AdminButton>
              </AdminModalButtons>
            </AdminModalContent>
          </AdminModal>
        )}
      </AdminStaffContainer>
    </>
  );
};

export default AdminStaff;
