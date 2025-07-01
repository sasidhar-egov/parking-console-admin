import React, { useReducer, useEffect } from 'react';
import { db } from '../../data/db';
import styled from 'styled-components';
import CustomerNavbarComponent from './CustomerNavbar';
import BookingModal from './CustomerBookingModel'; // Import the new component

// Styled Components with customer prefix
const CustomerHomeContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const CustomerTitle = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
`;

const CustomerSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  max-width: 800px;
  margin: 0 auto;
`;

const CustomerSlotCard = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.available ? 'pointer' : 'not-allowed'};
  background-color: ${props => props.available ? '#4CAF50' : '#9E9E9E'};
  color: white;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: ${props => props.available ? 'scale(1.05)' : 'none'};
    border-color: ${props => props.available ? '#2E7D32' : 'transparent'};
  }
`;

const CustomerSlotNumber = styled.div`
  font-size: 18px;
  margin-bottom: 5px;
`;

const CustomerSlotStatus = styled.p`
  font-size: 12px;
  opacity: 0.8;
`;

const CustomerAlert = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  font-weight: bold;
`;

const ErrorAlert = styled(CustomerAlert)`
  background-color: #f44336;
`;

// Reducer for managing state
const initialState = {
  slots: [],
  selectedSlot: null,
  showModal: false,
  showAlert: false,
  alertMessage: '',
  alertType: 'success', // 'success' or 'error'
  loading: true
};

const customerReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SLOTS':
      return { ...state, slots: action.payload, loading: false };
    case 'SELECT_SLOT':
      return { ...state, selectedSlot: action.payload, showModal: true };
    case 'CLOSE_MODAL':
      return { ...state, selectedSlot: null, showModal: false };
    case 'SHOW_ALERT':
      return {
        ...state,
        showAlert: true,
        alertMessage: action.payload.message,
        alertType: action.payload.type || 'success'
      };
    case 'HIDE_ALERT':
      return { ...state, showAlert: false, alertMessage: '', alertType: 'success' };
    case 'BOOK_SLOT':
      return {
        ...state,
        slots: state.slots.map(slot =>
          slot.id === action.payload ? { ...slot, booked: true } : slot
        ),
        showModal: false,
        selectedSlot: null
      };
    default:
      return state;
  }
};

const CustomerHomePage = () => {
  const [state, dispatch] = useReducer(customerReducer, initialState);

  // Fetching slots from database
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const allSlots = await db.slots.toArray();
        dispatch({ type: 'SET_SLOTS', payload: allSlots });
      } catch (error) {
        console.error("Error fetching slots from DB:", error);
        dispatch({
          type: 'SHOW_ALERT',
          payload: {
            message: 'Error loading parking slots',
            type: 'error'
          }
        });
      }
    };

    fetchSlots();
  }, []);



  const handleSlotClick = (slot) => {
    if (!slot.booked) {
      dispatch({ type: 'SELECT_SLOT', payload: slot });
    }
  };

  const handleBookingSuccess = (slotId) => {
    dispatch({ type: 'BOOK_SLOT', payload: slotId });
    dispatch({
      type: 'SHOW_ALERT',
      payload: {
        message: 'Slot booked successfully! 🎉',
        type: 'success'
      }
    });

    // Hide alert after 3 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_ALERT' });
    }, 3000);
  };

  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  // Hide alert manually if needed
  const hideAlert = () => {
    dispatch({ type: 'HIDE_ALERT' });
  };

  if (state.loading) {
    return (
      <CustomerHomeContainer>
        <CustomerTitle>Loading parking slots...</CustomerTitle>
      </CustomerHomeContainer>
    );
  }

  return (
    <CustomerHomeContainer>
      <CustomerTitle>Available Parking Slots</CustomerTitle>

      <CustomerSlotsGrid>
        {state.slots.map((slot) => (
          <CustomerSlotCard
            key={slot.id}
            available={!slot.booked}
            onClick={() => handleSlotClick(slot)}
          >
            <CustomerSlotNumber>{slot.number}</CustomerSlotNumber>
            <CustomerSlotStatus>
              {slot.booked ? 'Occupied' : 'Available'}
            </CustomerSlotStatus>
          </CustomerSlotCard>
        ))}
      </CustomerSlotsGrid>

      {/* Reusable Booking Modal */}
      <BookingModal
        isOpen={state.showModal}
        selectedSlot={state.selectedSlot}
        onClose={handleCloseModal}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Alert Messages */}
      {state.showAlert && (
        state.alertType === 'success' ? (
          <CustomerAlert onClick={hideAlert}>
            {state.alertMessage}
          </CustomerAlert>
        ) : (
          <ErrorAlert onClick={hideAlert}>
            {state.alertMessage}
          </ErrorAlert>
        )
      )}
    </CustomerHomeContainer>
  );
};

export default CustomerHomePage;