import React, { useReducer, useEffect, useState } from 'react';
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const initialState = {
  vehicleNumber: '',
  bookings: [],
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
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
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

const VehicleEntry = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const searchBookings = async () => {
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

      const bookedBookings = bookings.filter(booking => booking.status === 'booked');

      dispatch({ type: 'SET_BOOKINGS', payload: bookedBookings });

      if (bookedBookings.length === 0) {
        dispatch({
          type: 'SET_MESSAGE', payload: {
            type: 'error',
            text: 'No booked parking found for this vehicle number'
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

  const markVehicleEntry = async (booking) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const entryTime = new Date().toISOString();

      // Update booking status to active and set entry time
      await db.bookings.update(booking.id, {
        status: 'active',
        entryTime: entryTime
      });

      // Update slot to occupied
      await db.slots.update(booking.slotId, {
        occupied: true,
        vehicleNumber: booking.vehicleNumber,
        userName: booking.userName,
        entryTime: entryTime
      });

      dispatch({
        type: 'SET_MESSAGE', payload: {
          type: 'success',
          text: `Vehicle ${booking.vehicleNumber} successfully entered at slot ${booking.slotNumber}`
        }
      });

      // Clear form after success
      setTimeout(() => {
        dispatch({ type: 'CLEAR_FORM' });
      }, 2000);

    } catch (error) {
      dispatch({
        type: 'SET_MESSAGE', payload: {
          type: 'error',
          text: 'Error marking entry: ' + error.message
        }
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <>
      <Container>
        <Card>
          <Title>🚗 Vehicle Entry</Title>

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
              onKeyPress={(e) => e.key === 'Enter' && searchBookings()}
            />
            <Button onClick={searchBookings} disabled={state.loading}>
              {state.loading ? 'Searching...' : 'Search Bookings'}
            </Button>
          </SearchSection>

          {state.bookings.length > 0 && (
            <div>
              <h3>Available Bookings for Entry:</h3>
              {state.bookings.map((booking) => (
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
                    <span><strong>Duration:</strong> {booking.duration}</span>
                    <span><strong>Amount:</strong> ₹{booking.amount}</span>
                  </BookingDetail>
                  <BookingDetail>
                    <span><strong>Scheduled Entry:</strong> {new Date(booking.entryTime).toLocaleString()}</span>
                  </BookingDetail>

                  <Button
                    onClick={() => markVehicleEntry(booking)}
                    disabled={state.loading}
                    style={{ marginTop: '1rem' }}
                  >
                    {state.loading ? 'Processing...' : 'Mark Vehicle Entered'}
                  </Button>
                </BookingCard>
              ))}
            </div>
          )}
        </Card>
      </Container>
    </>
  );
};

export default VehicleEntry;