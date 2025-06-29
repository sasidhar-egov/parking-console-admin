import React, { useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db';
import AdminNavbar from './AdminNavBar';

const AdminStaffContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AdminTitle = styled.h2`
  color: #667eea;
  margin: 0;
`;

const AdminButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const AdminStaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const AdminStaffCard = styled.div`
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

const AdminStaffName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-size: 1.3rem;
`;

const AdminStaffInfo = styled.div`
  color: #6c757d;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdminStaffLabel = styled.span`
  font-weight: 500;
  min-width: 80px;
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

const AdminBookingsButton = styled.button`
  background: #17a2b8;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  
  &:hover {
    background: #138496;
  }
`;

const AdminModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AdminModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const AdminModalTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #667eea;
`;

const AdminInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const AdminModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const AdminCancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const AdminTableHeader = styled.th`
  background: #f8f9fa;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
  font-weight: 600;
  font-size: 0.9rem;
`;

const AdminTableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  font-size: 0.9rem;
`;

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
            return { ...state, staff: state.staff.filter(member => member.id !== action.payload) };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

const AdminStaff = () => {
    const [state, dispatch] = useReducer(adminStaffReducer, initialState);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [selectedStaffBookings, setSelectedStaffBookings] = useState([]);
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
        if (!formData.name || !formData.username || !formData.phone || !formData.password) {
            alert('Please fill all fields');
            return;
        }

        try {
            const existingUser = await db.users.where('username').equals(formData.username).first();
            if (existingUser) {
                alert('Username already exists!');
                return;
            }

            const newStaff = {
                ...formData,
                role: 'staff'
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
        if (!confirm('Are you sure you want to delete this staff member?')) return;

        try {
            await db.users.delete(staffId);
            dispatch({ type: 'DELETE_STAFF', payload: staffId });
        } catch (error) {
            alert('Error deleting staff: ' + error.message);
        }
    };

    const handleViewBookings = async (staffName) => {
        try {
            const bookings = await db.bookings.where('userName').equals(staffName).toArray();
            setSelectedStaffBookings(bookings);
            setShowBookingsModal(true);
        } catch (error) {
            alert('Error fetching bookings: ' + error.message);
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
            <AdminStaffContainer>
                <AdminNavbar currentPage="staff" />

                <AdminTitle>Loading Staff...</AdminTitle>
            </AdminStaffContainer>
        );
    }

    return (
        <AdminStaffContainer>
            <AdminNavbar currentPage="staff" />

            <AdminHeader>
                <AdminTitle>Staff Management</AdminTitle>
                <AdminButton onClick={() => setShowAddModal(true)}>
                    Add New Staff
                </AdminButton>
            </AdminHeader>

            <AdminStaffGrid>
                {state.staff.map(member => (
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
                        <AdminBookingsButton onClick={() => handleViewBookings(member.name)}>
                            View Bookings
                        </AdminBookingsButton>
                    </AdminStaffCard>
                ))}
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

            {showBookingsModal && (
                <AdminModal>
                    <AdminModalContent>
                        <AdminModalTitle>Staff Bookings</AdminModalTitle>
                        {selectedStaffBookings.length > 0 ? (
                            <AdminTable>
                                <thead>
                                    <tr>
                                        <AdminTableHeader>Slot</AdminTableHeader>
                                        <AdminTableHeader>Vehicle</AdminTableHeader>
                                        <AdminTableHeader>Entry Time</AdminTableHeader>
                                        <AdminTableHeader>Status</AdminTableHeader>
                                        <AdminTableHeader>Amount</AdminTableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedStaffBookings.map(booking => (
                                        <tr key={booking.id}>
                                            <AdminTableCell>#{booking.slotNumber}</AdminTableCell>
                                            <AdminTableCell>{booking.vehicleNumber}</AdminTableCell>
                                            <AdminTableCell>{new Date(booking.entryTime).toLocaleString()}</AdminTableCell>
                                            <AdminTableCell>{booking.status}</AdminTableCell>
                                            <AdminTableCell>₹{booking.amount || 0}</AdminTableCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </AdminTable>
                        ) : (
                            <p>No bookings found for this staff member.</p>
                        )}
                        <AdminModalButtons>
                            <AdminCancelButton onClick={() => setShowBookingsModal(false)}>
                                Close
                            </AdminCancelButton>
                        </AdminModalButtons>
                    </AdminModalContent>
                </AdminModal>
            )}
        </AdminStaffContainer>
    );
};

export default AdminStaff;