import React, { useReducer, useEffect } from 'react';
import { db } from '../../data/db';
import AdminNavbar from './AdminNavBar';

import {
  AdminBookingsContainer, AdminTitle, AdminStatsRow, AdminStatCard, AdminStatNumber, AdminStatLabel,
  AdminFiltersContainer, AdminFilterRow, AdminSearchInput, AdminFilterSelect,
  AdminTableContainer, AdminTable, AdminTableHeader, AdminTableCell, AdminStatusBadge,
  AdminEmptyState, AdminPagination, AdminPageButton
} from '../../styles/StyledComponents'; 

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
    booked: bookings.filter(b => b.status === 'booked').length,
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
      const bookings = await db.bookings.orderBy('bookingTime').reverse().toArray();
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
    return dateTime ? new Date(dateTime).toLocaleString() : 'N/A';
  };

  const formatDuration = (duration) => {
    if (!duration || typeof duration === 'string') return duration || 'N/A';
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

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
          <AdminStatCard><AdminStatNumber>{state.stats.total}</AdminStatNumber><AdminStatLabel>Total</AdminStatLabel></AdminStatCard>
          <AdminStatCard><AdminStatNumber>{state.stats.active}</AdminStatNumber><AdminStatLabel>Active</AdminStatLabel></AdminStatCard>
          <AdminStatCard><AdminStatNumber>{state.stats.completed}</AdminStatNumber><AdminStatLabel>Completed</AdminStatLabel></AdminStatCard>
          <AdminStatCard><AdminStatNumber>{state.stats.cancelled}</AdminStatNumber><AdminStatLabel>Cancelled</AdminStatLabel></AdminStatCard>
          <AdminStatCard><AdminStatNumber>{state.stats.booked}</AdminStatNumber><AdminStatLabel>Booked</AdminStatLabel></AdminStatCard>
          <AdminStatCard><AdminStatNumber>₹{state.stats.totalRevenue}</AdminStatNumber><AdminStatLabel>Revenue</AdminStatLabel></AdminStatCard>
        </AdminStatsRow>

        <AdminFiltersContainer>
          <AdminFilterRow>
            <AdminSearchInput
              placeholder="Search by vehicle/user/slot..."
              value={state.searchTerm}
              onChange={handleSearchChange}
            />
            <AdminFilterSelect value={state.statusFilter} onChange={handleStatusFilter}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="booked">Booked</option>
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
                    <AdminTableHeader>ID</AdminTableHeader>
                    <AdminTableHeader>Slot</AdminTableHeader>
                    <AdminTableHeader>Vehicle</AdminTableHeader>
                    <AdminTableHeader>User</AdminTableHeader>
                    <AdminTableHeader>Booking Time</AdminTableHeader>
                    <AdminTableHeader>Entry</AdminTableHeader>
                    <AdminTableHeader>Exit</AdminTableHeader>
                    <AdminTableHeader>Duration</AdminTableHeader>
                    <AdminTableHeader>Status</AdminTableHeader>
                    <AdminTableHeader>Amount</AdminTableHeader>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map(booking => (
                    <tr key={booking.id}>
                      <AdminTableCell>#{booking.id}</AdminTableCell>
                      <AdminTableCell>{booking.slotNumber}</AdminTableCell>
                      <AdminTableCell>{booking.vehicleNumber}</AdminTableCell>
                      <AdminTableCell>{booking.userName}</AdminTableCell>
                      <AdminTableCell>{formatDateTime(booking.bookingTime)}</AdminTableCell>
                      <AdminTableCell>{formatDateTime(booking.entryTime)}</AdminTableCell>
                      <AdminTableCell>{formatDateTime(booking.exitTime)}</AdminTableCell>
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
                  >Previous</AdminPageButton>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <AdminPageButton
                      key={page}
                      active={page === state.currentPage}
                      onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: page })}
                    >{page}</AdminPageButton>
                  ))}

                  <AdminPageButton
                    onClick={() => dispatch({ type: 'SET_CURRENT_PAGE', payload: state.currentPage + 1 })}
                    disabled={state.currentPage === totalPages}
                  >Next</AdminPageButton>
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
