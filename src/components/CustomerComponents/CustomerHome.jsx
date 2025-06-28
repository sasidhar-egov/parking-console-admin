import React, { useReducer, useEffect } from 'react';
import { db } from '../../data/db';
import styled from 'styled-components';
import CustomerNavbarComponent from './CustomerNavbar';
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

const CustomerModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CustomerModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
`;

const CustomerModalTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const CustomerModalText = styled.p`
  color: #666;
  margin-bottom: 25px;
  font-size: 16px;
`;

const CustomerButton = styled.button`
  padding: 12px 24px;
  margin: 0 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background-color: #4CAF50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
  }

  &.secondary {
    background-color: #f0f0f0;
    color: #333;
    &:hover {
      background-color: #e0e0e0;
    }
  }
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

// Reducer for managing state
const initialState = {
  slots: [],
  selectedSlot: null,
  showModal: false,
  showAlert: false,
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
      return { ...state, showAlert: true };
    case 'HIDE_ALERT':
      return { ...state, showAlert: false };
    case 'BOOK_SLOT':
      return {
        ...state,
        slots: state.slots.map(slot =>
          slot.id === action.payload ? { ...slot, occupied: true } : slot
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

  // Mock data - replace with actual Dexie db calls
  useEffect(() => {
  const fetchSlots = async () => {
    try {
      const allSlots = await db.slots.toArray();

      // Optional: If database is empty, you can prepopulate
      if (allSlots.length === 0) {
        const defaultSlots = Array.from({ length: 20 }, (_, i) => ({
          number: `P${String(i + 1).padStart(3, '0')}`,
          occupied: false,
          vehicleNumber: null,
          userName: null,
          entryTime: null
        }));
        await db.slots.bulkAdd(defaultSlots);
        dispatch({ type: 'SET_SLOTS', payload: await db.slots.toArray() });
      } else {
        dispatch({ type: 'SET_SLOTS', payload: allSlots });
      }
    } catch (error) {
      console.error("Error fetching slots from DB:", error);
    }
  };

  fetchSlots();
}, []);


  const handleSlotClick = (slot) => {
    if (!slot.occupied) {
      dispatch({ type: 'SELECT_SLOT', payload: slot });
    }
  };

  const handleBookSlot = async () => {
  if (state.selectedSlot) {
    try {
      const now = new Date().toISOString();
      const vehicleNumber = 'VEHICLE123'; // Replace with user input
      const userName = 'some_user';       // Replace with current user

      await db.slots.update(state.selectedSlot.id, {
        occupied: true,
        vehicleNumber,
        userName,
        entryTime: now
      });

      await db.bookings.add({
        slotId: state.selectedSlot.id,
        slotNumber: state.selectedSlot.number,
        vehicleNumber,
        userName,
        entryTime: now,
        exitTime: null,
        status: 'booked',
        duration: null,
        amount: null
      });

      dispatch({ type: 'BOOK_SLOT', payload: state.selectedSlot.id });
      dispatch({ type: 'SHOW_ALERT' });

      setTimeout(() => {
        dispatch({ type: 'HIDE_ALERT' });
      }, 3000);
    } catch (err) {
      console.error("Booking failed:", err);
    }
  }
};


  const handleCloseModal = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  if (state.loading) {
    return (
      <CustomerHomeContainer>
        <CustomerNavbarComponent/>
        <CustomerTitle>Loading parking slots...</CustomerTitle>
      </CustomerHomeContainer>
    );
  }

  return (
    <CustomerHomeContainer>
        <CustomerNavbarComponent/>
      <CustomerTitle>Available Parking Slots</CustomerTitle>
      
      <CustomerSlotsGrid>
        {state.slots.map((slot) => (
          <CustomerSlotCard
            key={slot.id}
            available={!slot.occupied}
            onClick={() => handleSlotClick(slot)}
          >
            <CustomerSlotNumber>{slot.number}</CustomerSlotNumber>
            <CustomerSlotStatus>
              {slot.occupied ? 'Occupied' : 'Available'}
            </CustomerSlotStatus>
          </CustomerSlotCard>
        ))}
      </CustomerSlotsGrid>

      {state.showModal && state.selectedSlot && (
        <CustomerModal onClick={handleCloseModal}>
          <CustomerModalContent onClick={(e) => e.stopPropagation()}>
            <CustomerModalTitle>Book Parking Slot</CustomerModalTitle>
            <CustomerModalText>
              Do you want to book parking slot {state.selectedSlot.number}?
            </CustomerModalText>
            <div>
              <CustomerButton 
                className="primary" 
                onClick={handleBookSlot}
              >
                Book Now
              </CustomerButton>
              <CustomerButton 
                className="secondary" 
                onClick={handleCloseModal}
              >
                Cancel
              </CustomerButton>
            </div>
          </CustomerModalContent>
        </CustomerModal>
      )}

      {state.showAlert && (
        <CustomerAlert>
          Slot booked successfully! 🎉
        </CustomerAlert>
      )}
    </CustomerHomeContainer>
  );
};

export default CustomerHomePage;