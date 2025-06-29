import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db';
import StaffNavbar from './StaffNavBar';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const StatCard = styled(Card)`
  text-align: center;
  background: linear-gradient(135deg, ${props => props.gradient});
  color: white;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SlotCard = styled.div`
  background: ${props =>
    props.status === 'booked' ? '#ffc107' :
    props.status === 'active' ? '#dc3545' :
    '#28a745'};
  color: white;
  padding: 1rem;
  min-height: 2rem;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const BookingCard = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const BookingDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;

  strong {
    color: #333;
  }
`;

const StatusBadge = styled.span`
  background: ${props =>
    props.status === 'booked' ? '#ffc107' :
    props.status === 'active' ? '#28a745' :
    props.status === 'completed' ? '#6c757d' : '#dc3545'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: 500;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
  }
`;

// Initial state & reducer
const initialState = {
  stats: {
    totalSlots: 0,
    occupiedSlots: 0,
    availableSlots: 0,
    activeBookings: 0,
    bookedSlots: 0
  },
  slots: [],
  recentBookings: [],
  allBookings: [],
  loading: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_SLOTS':
      return { ...state, slots: action.payload };
    case 'SET_RECENT_BOOKINGS':
      return { ...state, recentBookings: action.payload };
    case 'SET_ALL_BOOKINGS':
      return { ...state, allBookings: action.payload };
    default:
      return state;
  }
};

// Main Component
const StaffDashboard = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadDashboardData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const slots = await db.slots.toArray();
      const bookings = await db.bookings.toArray();

      const occupiedSlots = slots.filter(slot => slot.occupied);
      const activeBookings = bookings.filter(b => b.status === 'active');
      const bookedSlots = bookings.filter(b => b.status === 'booked');

      const recentBookings = await db.bookings
        .orderBy('id')
        .reverse()
        .limit(10)
        .toArray();

      dispatch({
        type: 'SET_STATS',
        payload: {
          totalSlots: slots.length,
          occupiedSlots: occupiedSlots.length,
          availableSlots: slots.length - occupiedSlots.length,
          activeBookings: activeBookings.length,
          bookedSlots: bookedSlots.length
        }
      });

      dispatch({ type: 'SET_SLOTS', payload: slots });
      dispatch({ type: 'SET_RECENT_BOOKINGS', payload: recentBookings });
      dispatch({ type: 'SET_ALL_BOOKINGS', payload: bookings });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getSlotStatus = (slotNumber) => {
    const booking = state.allBookings.find(
      (b) => b.slotNumber === slotNumber && ['booked', 'active'].includes(b.status)
    );
    return booking ? booking.status : 'available';
  };

  return (
    <>
      <StaffNavbar currentPage="home" />
      <Container>
        <RefreshButton onClick={loadDashboardData} disabled={state.loading}>
          {state.loading ? 'Loading...' : '🔄 Refresh Dashboard'}
        </RefreshButton>

        <Grid>
          <StatCard gradient="#667eea 0%, #764ba2 100%">
            <StatNumber>{state.stats.totalSlots}</StatNumber>
            <StatLabel>Total Slots</StatLabel>
          </StatCard>
          <StatCard gradient="#28a745 0%, #20c997 100%">
            <StatNumber>{state.stats.availableSlots}</StatNumber>
            <StatLabel>Available Slots</StatLabel>
          </StatCard>
          <StatCard gradient="#dc3545 0%, #fd7e14 100%">
            <StatNumber>{state.stats.occupiedSlots}</StatNumber>
            <StatLabel>Occupied Slots</StatLabel>
          </StatCard>
          <StatCard gradient="#ffc107 0%, #fd7e14 100%">
            <StatNumber>{state.stats.activeBookings}</StatNumber>
            <StatLabel>Active Bookings</StatLabel>
          </StatCard>
          <StatCard gradient="#17a2b8 0%, #20c997 100%">
            <StatNumber>{state.stats.bookedSlots}</StatNumber>
            <StatLabel>Booked Slots</StatLabel>
          </StatCard>
        </Grid>

        <Grid>
          <Card>
            <Title>🅿️ Parking Slots Overview</Title>
            <SlotsGrid>
              {state.slots.map((slot) => {
                const status = getSlotStatus(slot.number);
                return (
                  <SlotCard key={slot.id} status={status}>
                    <div>{slot.number}</div>
                    {status !== 'available' && (
                      <div style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>
                        {slot.vehicleNumber}
                      </div>
                    )}
                  </SlotCard>
                );
              })}
            </SlotsGrid>
          </Card>

          <Card>
            <Title>📋 Recent Bookings</Title>
            {state.recentBookings.length === 0 ? (
              <p>No recent bookings found.</p>
            ) : (
              state.recentBookings.map((booking) => (
                <BookingCard key={booking.id}>
                  <BookingDetail>
                    <span><strong>Slot:</strong> {booking.slotNumber}</span>
                    <StatusBadge status={booking.status}>
                      {booking.status.toUpperCase()}
                    </StatusBadge>
                  </BookingDetail>
                  <BookingDetail>
                    <span><strong>Vehicle:</strong> {booking.vehicleNumber}</span>
                    <span><strong>Customer:</strong> {booking.userName}</span>
                  </BookingDetail>
                  <BookingDetail>
                    <span><strong>Duration:</strong> {booking.duration}</span>
                    <span><strong>Amount:</strong> ₹{booking.amount}</span>
                  </BookingDetail>
                  {booking.entryTime && (
                    <BookingDetail>
                      <span><strong>Entry:</strong> {new Date(booking.entryTime).toLocaleString()}</span>
                      {booking.exitTime && (
                        <span><strong>Exit:</strong> {new Date(booking.exitTime).toLocaleString()}</span>
                      )}
                    </BookingDetail>
                  )}
                </BookingCard>
              ))
            )}
          </Card>
        </Grid>
      </Container>
    </>
  );
};

export default StaffDashboard;
