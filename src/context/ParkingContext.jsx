// context/ParkingContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Mock IndexedDB operations (simplified)
const mockDB = {
  slots: Array.from({length: 20}, (_, i) => ({
    id: i + 1,
    number: `A${i + 1}`,
    occupied: false,
    vehicleNumber: null,
    userName: null,
    entryTime: null
  })),
  bookings: [],
  users: [
    { id: 1, name: 'John Doe', phone: '9876543210' },
    { id: 2, name: 'Jane Smith', phone: '9876543211' }
  ]
};

const ParkingContext = createContext();

const initialState = {
  slots: mockDB.slots,
  bookings: mockDB.bookings,
  users: mockDB.users,
  currentUser: null
};

const parkingReducer = (state, action) => {
  switch (action.type) {
    case 'BOOK_SLOT':
      const updatedSlots = state.slots.map(slot => 
        slot.id === action.payload.slotId 
          ? { 
              ...slot, 
              occupied: true, 
              vehicleNumber: action.payload.vehicleNumber, 
              userName: action.payload.userName, 
              entryTime: new Date().toISOString() 
            }
          : slot
      );
      const newBooking = {
        id: Date.now(),
        slotId: action.payload.slotId,
        vehicleNumber: action.payload.vehicleNumber,
        userName: action.payload.userName,
        entryTime: new Date().toISOString(),
        exitTime: null,
        status: 'active'
      };
      return {
        ...state,
        slots: updatedSlots,
        bookings: [...state.bookings, newBooking]
      };
    
    case 'EXIT_VEHICLE':
      const exitUpdatedSlots = state.slots.map(slot => 
        slot.id === action.payload.slotId 
          ? { 
              ...slot, 
              occupied: false, 
              vehicleNumber: null, 
              userName: null, 
              entryTime: null 
            }
          : slot
      );
      const exitUpdatedBookings = state.bookings.map(booking => 
        booking.slotId === action.payload.slotId && booking.status === 'active'
          ? { 
              ...booking, 
              exitTime: new Date().toISOString(), 
              status: 'completed' 
            }
          : booking
      );
      return {
        ...state,
        slots: exitUpdatedSlots,
        bookings: exitUpdatedBookings
      };
    
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    
    default:
      return state;
  }
};

export const ParkingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(parkingReducer, initialState);
  return (
    <ParkingContext.Provider value={{ state, dispatch }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within ParkingProvider');
  }
  return context;
};