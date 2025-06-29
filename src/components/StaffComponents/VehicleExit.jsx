import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db'; // Import your database
import StaffNavbar from './StaffNavBar';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const SearchButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const BookingCard = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const BookingDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  strong {
    color: #333;
  }
`;

const StatusBadge = styled.span`
  background: ${props =>
    props.status === 'booked' ? '#ffc107' :
      props.status === 'active' ? '#28a745' :
        props.status === 'completed' ? '#6c757d' : '#dc3545'
  };
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  background: ${props =>
    props.type === 'success' ? '#d4edda' :
      props.type === 'error' ? '#f8d7da' : '#d1ecf1'
  };
  color: ${props =>
    props.type === 'success' ? '#155724' :
      props.type === 'error' ? '#721c24' : '#0c5460'
  };
  border: 1px solid ${props =>
    props.type === 'success' ? '#c3e6cb' :
      props.type === 'error' ? '#f5c6cb' : '#bee5eb'
  };
`;

const TimeInfo = styled.div`
  background: #e9ecef;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const initialState = {
  vehicleNumber: '',
  activeBookings: [],
  selectedBooking: null,
  loading: false,
  message: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VEHICLE_NUMBER':
      return { ...state, vehicleNumber: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ACTIVE_BOOKINGS':
      return { ...state, activeBookings: action.payload };
    case 'SET_SELECTED_BOOKING':
      return { ...state, selectedBooking: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'CLEAR_FORM':
      return { ...initialState };
    default:
      return state;
  }
};

const VehicleExit = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const calculateDuration = (entryTime) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diffMs = now - entry;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return diffHours;
  };

  const calculateAmount = (hours) => {
    // ₹30 per hour
    return hours * 30;
  };

  const searchActiveBookings = async () => {
    if (!state.vehicleNumber.trim()) {
      dispatch({ type: 'SET_MESSAGE', payload: { type: 'error', text: 'Please enter vehicle number' } });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_MESSAGE', payload: null });

    try {
      const bookings = await db.bookings
        .where('vehicleNumber')
        .equals(state.vehicleNumber.toUpperCase())
        .toArray();

      const activeBookings = bookings.filter(booking => booking.status === 'active');

      dispatch({ type: 'SET_ACTIVE_BOOKINGS', payload: activeBookings });

      if (activeBookings.length === 0) {
        dispatch({
          type: 'SET_MESSAGE', payload: {
            type: 'error',
            text: 'No active parking found for this vehicle number'
          }
        });
      }
    } catch (error) {
      dispatch({
        type: 'SET_MESSAGE', payload: {
          type: 'error',
          text: 'Error searching bookings: ' + error.message
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markVehicleExit = async (booking) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const exitTime = new Date().toISOString();
      const actualHours = calculateDuration(booking.entryTime);
      const finalAmount = calculateAmount(actualHours);

      // Update booking status to completed and set exit time
      await db.bookings.update(booking.id, {
        status: 'completed',
        exitTime: exitTime,
        duration: `${actualHours} hours`,
        amount: finalAmount
      });

      // Update slot to available
      await db.slots.update(booking.slotId, {
        occupied: false,
        vehicleNumber: null,
        userName: null,
        entryTime: null
      });

      dispatch({
        type: 'SET_MESSAGE', payload: {
          type: 'success',
          text: `Vehicle ${booking.vehicleNumber} successfully exited from slot ${booking.slotNumber}. Total Amount: ₹${finalAmount}`
        }
      });

      // Clear form after success
      setTimeout(() => {
        dispatch({ type: 'CLEAR_FORM' });
      }, 3000);

    } catch (error) {
      dispatch({
        type: 'SET_MESSAGE', payload: {
          type: 'error',
          text: 'Error marking exit: ' + error.message
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <>
      <StaffNavbar currentPage="vehicle-exit" />
      <Container>
        <Card>
          <Title>🚪 Vehicle Exit</Title>

          {state.message && (
            <Message type={state.message.type}>
              {state.message.text}
            </Message>
          )}

          <SearchSection>
            <Input
              type="text"
              placeholder="Enter Vehicle Number (e.g., KA01MN1234)"
              value={state.vehicleNumber}
              onChange={(e) => dispatch({ type: 'SET_VEHICLE_NUMBER', payload: e.target.value.toUpperCase() })}
              onKeyPress={(e) => e.key === 'Enter' && searchActiveBookings()}
            />
            <SearchButton onClick={searchActiveBookings} disabled={state.loading}>
              {state.loading ? 'Searching...' : 'Search Active Parking'}
            </SearchButton>
          </SearchSection>

          {state.activeBookings.length > 0 && (
            <div>
              <h3>Active Parking for Exit:</h3>
              {state.activeBookings.map((booking) => {
                const actualHours = calculateDuration(booking.entryTime);
                const finalAmount = calculateAmount(actualHours);

                return (
                  <BookingCard key={booking.id}>
                    <BookingDetail>
                      <span><strong>Slot:</strong> {booking.slotNumber}</span>
                      <StatusBadge status={booking.status}>{booking.status.toUpperCase()}</StatusBadge>
                    </BookingDetail>
                    <BookingDetail>
                      <span><strong>Vehicle:</strong> {booking.vehicleNumber}</span>
                      <span><strong>Customer:</strong> {booking.userName}</span>
                    </BookingDetail>
                    <BookingDetail>
                      <span><strong>Entry Time:</strong> {new Date(booking.entryTime).toLocaleString()}</span>
                    </BookingDetail>

                    <TimeInfo>
                      <BookingDetail>
                        <span><strong>Parked Duration:</strong> {actualHours} hours</span>
                        <span><strong>Total Amount:</strong> ₹{finalAmount}</span>
                      </BookingDetail>
                      <BookingDetail>
                        <span><strong>Rate:</strong> ₹30 per hour</span>
                        <span><strong>Exit Time:</strong> {new Date().toLocaleString()}</span>
                      </BookingDetail>
                    </TimeInfo>

                    <Button
                      onClick={() => markVehicleExit(booking)}
                      disabled={state.loading}
                      style={{ marginTop: '1rem' }}
                    >
                      {state.loading ? 'Processing Exit...' : 'Mark Vehicle Exited'}
                    </Button>
                  </BookingCard>
                );
              })}
            </div>
          )}
        </Card>
      </Container>
    </>
  );
};

export default VehicleExit;