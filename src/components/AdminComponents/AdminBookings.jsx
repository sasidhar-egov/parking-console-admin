import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db';
import AdminNavbar from './AdminNavBar';

const AdminBookingsContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const AdminTitle = styled.h2`
  color: #667eea;
  margin-bottom: 2rem;
`;

const AdminFiltersContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const AdminFilterRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const AdminSearchInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 200px;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const AdminFilterSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const AdminStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AdminStatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
`;

const AdminStatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const AdminStatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const AdminTableContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const AdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const AdminTableHeader = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
  color: #495057;
  font-weight: 600;
  position: sticky;
  top: 0;
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
      case 'active': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const AdminEmptyState = styled.div`
  text-align: center;
  color: #6c757d;
  padding: 3rem;
`;

const AdminPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const AdminPageButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#667eea'};
  border: 2px solid #667eea;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const initialState = {
  bookings: [],
  filteredBookings: [],
  loading: true,
  error: null,
  searchTerm: '',
  statusFilter: 'all',
  currentPage: 1,
  bookingsPerPage: 10,
  stats: {
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    booked: 0,
    totalRevenue: 0
  }
};

const adminBookingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BOOKINGS':
      const filteredBookings = action.payload.filter(booking =>
        filterBooking(booking, state.searchTerm, state.statusFilter)
      );
      return {
        ...state,
        bookings: action.payload,
        filteredBookings,
        stats: calculateStats(action.payload),
        loading: false
      };
    case 'SET_SEARCH_TERM':
      const searchFiltered = state.bookings.filter(booking =>
        filterBooking(booking, action.payload, state.statusFilter)
      );
      return {
        ...state,
        searchTerm: action.payload,
        filteredBookings: searchFiltered,
        currentPage: 1
      };
    case 'SET_STATUS_FILTER':
      const statusFiltered = state.bookings.filter(booking =>
        filterBooking(booking, state.searchTerm, action.payload)
      );
      return {
        ...state,
        statusFilter: action.payload,
        filteredBookings: statusFiltered,
        currentPage: 1
      };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const filterBooking = (booking, searchTerm, statusFilter) => {
  const matchesSearch = !searchTerm ||
    booking.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.slotNumber.toString().includes(searchTerm);

  const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

  return matchesSearch && matchesStatus;
};

const calculateStats = (bookings) => {
  return {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    booked: bookings.filter(b => b.status === "booked").length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
  };
};

const AdminBookings = () => {
  const [state, dispatch] = useReducer(adminBookingsReducer, initialState);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const bookings = await db.bookings.orderBy('entryTime').reverse().toArray();
      dispatch({ type: 'SET_BOOKINGS', payload: bookings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const handleSearchChange = (e) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  };

  const handleStatusFilter = (e) => {
    dispatch({ type: 'SET_STATUS_FILTER', payload: e.target.value });
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  // Pagination logic
  const totalPages = Math.ceil(state.filteredBookings.length / state.bookingsPerPage);
  const startIndex = (state.currentPage - 1) * state.bookingsPerPage;
  const currentBookings = state.filteredBookings.slice(startIndex, startIndex + state.bookingsPerPage);

  if (state.loading) {
    return (
      <>
        <AdminNavbar currentPage="bookings" />
        <AdminBookingsContainer>


          <AdminTitle>Loading Bookings...</AdminTitle>
        </AdminBookingsContainer>
      </>
    );
  }

  return (
    <>
      <AdminNavbar currentPage="bookings" />
      <AdminBookingsContainer>

        <AdminTitle>Bookings Management</AdminTitle>

        <AdminStatsRow>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.total}</AdminStatNumber>
            <AdminStatLabel>Total Bookings</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.active}</AdminStatNumber>
            <AdminStatLabel>Active</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.completed}</AdminStatNumber>
            <AdminStatLabel>Completed</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.cancelled}</AdminStatNumber>
            <AdminStatLabel>Cancelled</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>{state.stats.booked}</AdminStatNumber>
            <AdminStatLabel>Booked</AdminStatLabel>
          </AdminStatCard>
          <AdminStatCard>
            <AdminStatNumber>₹{state.stats.totalRevenue}</AdminStatNumber>
            <AdminStatLabel>Total Revenue</AdminStatLabel>
          </AdminStatCard>
        </AdminStatsRow>

        <AdminFiltersContainer>
          <AdminFilterRow>
            <AdminSearchInput
              type="text"
              placeholder="Search by vehicle, user, or slot..."
              value={state.searchTerm}
              onChange={handleSearchChange}
            />
            <AdminFilterSelect value={state.statusFilter} onChange={handleStatusFilter}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="booked">booked</option>

            </AdminFilterSelect>
          </AdminFilterRow>
        </AdminFiltersContainer>

        <AdminTableContainer>
          {currentBookings.length === 0 ? (
            <AdminEmptyState>
              <h3>No bookings found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </AdminEmptyState>
          ) : (
            <>
              <AdminTable>
                <thead>
                  <tr>
                    <AdminTableHeader>Booking ID</AdminTableHeader>
                    <AdminTableHeader>Slot</AdminTableHeader>
                    <AdminTableHeader>Vehicle</AdminTableHeader>
                    <AdminTableHeader>User</AdminTableHeader>
                    <AdminTableHeader>Entry Time</AdminTableHeader>
                    <AdminTableHeader>Exit Time</AdminTableHeader>
                    <AdminTableHeader>Duration</AdminTableHeader>
                    <AdminTableHeader>Status</AdminTableHeader>
                    <AdminTableHeader>Amount</AdminTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map(booking => (
                    <tr key={booking.id}>
                      <AdminTableCell>#{booking.id}</AdminTableCell>
                      <AdminTableCell>#{booking.slotNumber}</AdminTableCell>
                      <AdminTableCell>{booking.vehicleNumber}</AdminTableCell>
                      <AdminTableCell>{booking.userName}</AdminTableCell>
                      <AdminTableCell>{formatDateTime(booking.entryTime)}</AdminTableCell>
                      <AdminTableCell>
                        {booking.exitTime ? formatDateTime(booking.exitTime) : 'N/A'}
                      </AdminTableCell>
                      <AdminTableCell>{formatDuration(booking.duration)}</AdminTableCell>
                      <AdminTableCell>
                        <AdminStatusBadge status={booking.status}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </AdminStatusBadge>
                      </AdminTableCell>
                      <AdminTableCell>₹{booking.amount || 0}</AdminTableCell>
                    </tr>
                  ))}
                </tbody>
              </AdminTable>

              {totalPages > 1 && (
                <AdminPagination>
                  <AdminPageButton
                    onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: state.currentPage - 1 })}
                    disabled={state.currentPage === 1}
                  >
                    Previous
                  </AdminPageButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <AdminPageButton
                      key={page}
                      active={page === state.currentPage}
                      onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: page })}
                    >
                      {page}
                    </AdminPageButton>
                  ))}

                  <AdminPageButton
                    onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1 })}
                    disabled={state.currentPage === totalPages}
                  >
                    Next
                  </AdminPageButton>
                </AdminPagination>
              )}
            </>
          )}
        </AdminTableContainer>
      </AdminBookingsContainer>
    </>
  );
};

export default AdminBookings;