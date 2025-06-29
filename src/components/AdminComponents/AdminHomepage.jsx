import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db';
import AdminNavbar from './AdminNavBar';

const AdminHomeContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const AdminStatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  transform: translateY(0);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const AdminStatNumber = styled.h2`
  font-size: 3rem;
  margin: 0 0 0.5rem 0;
  font-weight: bold;
`;

const AdminStatLabel = styled.p`
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const AdminRecentSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const AdminSectionTitle = styled.h3`
  color: #667eea;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const AdminTableHeader = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
  font-weight: 600;
`;

const AdminTableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
`;

const AdminStatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'occupied': return '#dc3545';
      case 'available': return '#28a745';
      case 'active': return '#007bff';
      case 'completed': return '#6c757d';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const initialState = {
  stats: {
    totalSlots: 0,
    occupiedSlots: 0,
    totalUsers: 0,
    totalStaff: 0,
    activeBookings: 0
  },
  recentBookings: [],
  loading: true,
  error: null
};

const adminHomeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_RECENT_BOOKINGS':
      return { ...state, recentBookings: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const AdminHome = () => {
  const [state, dispatch] = useReducer(adminHomeReducer, initialState);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const [slots, users, bookings] = await Promise.all([
        db.slots.toArray(),
        db.users.toArray(),
        db.bookings.orderBy('entryTime').reverse().limit(10).toArray()
      ]);

      const occupiedSlots = slots.filter(slot => slot.occupied).length;
      const staff = users.filter(user => user.role === 'staff');
      const activeBookings = bookings.filter(booking => booking.status === 'active').length;

      dispatch({
        type: 'SET_STATS',
        payload: {
          totalSlots: slots.length,
          occupiedSlots,
          totalUsers: users.length,
          totalStaff: staff.length,
          activeBookings
        }
      });

      dispatch({ type: 'SET_RECENT_BOOKINGS', payload: bookings });
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (state.loading) {
    return (
      <>
        <AdminNavbar currentPage="home" />
        <AdminHomeContainer>
          <AdminSectionTitle>Loading Dashboard...</AdminSectionTitle>
        </AdminHomeContainer>
      </>
    );
  }

  return (
    <>
      <AdminNavbar currentPage="home" />
      <AdminHomeContainer>
        <AdminStatsGrid>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.totalSlots}</AdminStatNumber>
            <AdminStatLabel>Total Slots</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.occupiedSlots}</AdminStatNumber>
            <AdminStatLabel>Occupied Slots</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.totalUsers}</AdminStatNumber>
            <AdminStatLabel>Total Users</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.totalStaff}</AdminStatNumber>
            <AdminStatLabel>Staff Members</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.activeBookings}</AdminStatNumber>
            <AdminStatLabel>Active Bookings</AdminStatLabel>
          </AdminStatCard>
        </AdminStatsGrid>

        <AdminRecentSection>
          <AdminSectionTitle>Recent Bookings</AdminSectionTitle>
          <AdminTable>
            <thead>
              <tr>
                <AdminTableHeader>Slot</AdminTableHeader>
                <AdminTableHeader>Vehicle</AdminTableHeader>
                <AdminTableHeader>User</AdminTableHeader>
                <AdminTableHeader>Entry Time</AdminTableHeader>
                <AdminTableHeader>Status</AdminTableHeader>
                <AdminTableHeader>Amount</AdminTableHeader>
              </tr>
            </thead>
            <tbody>
              {state.recentBookings.map(booking => (
                <tr key={booking.id}>
                  <AdminTableCell>#{booking.slotNumber}</AdminTableCell>
                  <AdminTableCell>{booking.vehicleNumber}</AdminTableCell>
                  <AdminTableCell>{booking.userName}</AdminTableCell>
                  <AdminTableCell>{formatDateTime(booking.entryTime)}</AdminTableCell>
                  <AdminTableCell>
                    <AdminStatusBadge status={booking.status}>
                      {booking.status}
                    </AdminStatusBadge>
                  </AdminTableCell>
                  <AdminTableCell>₹{booking.amount || 0}</AdminTableCell>
                </tr>
              ))}
            </tbody>
          </AdminTable>
        </AdminRecentSection>
      </AdminHomeContainer>
    </>
  );
};

export default AdminHome;