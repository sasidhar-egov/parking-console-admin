import React, { useReducer } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db';

const Modal = styled.div`
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
  padding: 16px;
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 8px;
    max-width: none;
    margin: 0 8px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    margin: 0 4px;
  }
`;

const ModalTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.125rem;
    margin-bottom: 12px;
  }
`;

const ModalText = styled.p`
  color: #666;
  margin-bottom: 25px;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 16px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
  font-size: 14px;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  
  &:focus {
    border-color: #4CAF50;
    outline: none;
  }
  
  &.error {
    border-color: #f44336;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 16px; /* Keep 16px to prevent zoom on iOS */
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    border-radius: 4px;
  }
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 0;
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;

  &.primary {
    background-color: #4CAF50;
    color: white;
    &:hover {
      background-color: #45a049;
    }
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background-color: #f0f0f0;
    color: #333;
    &:hover {
      background-color: #e0e0e0;
    }
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 14px;
    min-width: 80px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 16px;
    width: 100%;
    min-width: unset;
    border-radius: 4px;
  }
`;

// Initial state for useReducer
const initialState = {
  vehicleNumber: '',
  error: '',
  isLoading: false
};

// Reducer function
const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VEHICLE_NUMBER':
      return { ...state, vehicleNumber: action.payload, error: '' };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_FORM':
      return { ...initialState };
    default:
      return state;
  }
};

const BookingModal = ({
  isOpen,
  selectedSlot,
  onClose,
  onBookingSuccess
}) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const validateVehicleNumber = (number) => {
    if (!number || number.trim().length === 0) {
      return 'Vehicle number is required';
    }
    if (number.trim().length < 3) {
      return 'Vehicle number must be at least 3 characters';
    }
    return null;
  };

  const checkIfVehicleAlreadyParked = async (vehicleNumber) => {
    try {
      // Check if vehicle is already parked (has an active booking)
      const existingBooking = await db.bookings
        .where('vehicleNumber')
        .equals(vehicleNumber.trim().toUpperCase())
        .and(booking => booking.status === 'booked')
        .first();

      return existingBooking !== undefined;
    } catch (error) {
      console.error('Error checking vehicle:', error);
      // Assume not parked if there's a DB error to allow booking attempt
      return false;
    }
  };



  const checkIfUserInSlots = async (username) => {
    try {
      // Check if user is already in slots table (occupied slot)
      const existingSlot = await db.slots
        .where('userName')
        .equals(username)
        .and(slot => slot.occupied === true)
        .first();

      return existingSlot !== undefined;
    } catch (error) {
      console.error('Error checking user in slots:', error);
      return false;
    }
  };

  const handleClose = () => {
    dispatch({ type: 'RESET_FORM' });
    onClose();
  };

  const handleBookSlot = async () => {
    const trimmedVehicleNumber = state.vehicleNumber.trim().toUpperCase();

    const validationError = validateVehicleNumber(trimmedVehicleNumber);
    if (validationError) {
      dispatch({ type: 'SET_ERROR', payload: validationError });
      return;
    }

    // Set loading state and clear previous errors
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });

    try {
      const username = localStorage.getItem('username');


      // Check if vehicle is already parked
      const isVehicleAlreadyParked = await checkIfVehicleAlreadyParked(trimmedVehicleNumber);
      if (isVehicleAlreadyParked) {
        throw new Error('This vehicle is already parked. Please exit first.');
      }
      
      
      // Additional check: verify user is not in slots table
      const userInSlots = await checkIfUserInSlots(username);
      if (userInSlots) {
        throw new Error('You are already parked in a slot. Please exit first before booking a new slot.');
      }

      const now = new Date().toISOString();

      await db.slots.update(selectedSlot.id, {
        occupied: false,
        booked:true,
        vehicleNumber: trimmedVehicleNumber,
        userName: username,
        entryTime: now
      });

      // Create a new booking record
      await db.bookings.add({
        slotId: selectedSlot.id,
        slotNumber: selectedSlot.number,
        vehicleNumber: trimmedVehicleNumber,
        userName: username,
        bookingTime: now,
        entryTime:null,
        exitTime: null,
        status: 'booked',
        duration: null,
        amount: null
      });

      // On success, call callback and close/reset the modal
      onBookingSuccess?.(selectedSlot.id);
      handleClose();

    } catch (error) {
      console.error('Booking failed:', error);
      // Use the specific error message if it was thrown intentionally, otherwise a generic one
      const message = error.message || 'Booking failed. Please try again.';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      // Always stop loading indicator
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (!isOpen || !selectedSlot) return null;

  return (
      <Modal onClick={handleClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>Book Parking Slot</ModalTitle>
          <ModalText>
            Booking slot {selectedSlot.number}
          </ModalText>

          <InputGroup>
            <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
            <Input
              id="vehicleNumber"
              type="text"
              value={state.vehicleNumber}
              onChange={(e) => dispatch({ type: 'SET_VEHICLE_NUMBER', payload: e.target.value })}
              placeholder="Enter vehicle number (e.g., KA01AB1234)"
              className={state.error ? 'error' : ''}
              disabled={state.isLoading}
              autoFocus
            />
            {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
          </InputGroup>

          <ButtonGroup>
            <Button
              className="primary"
              onClick={handleBookSlot}
              disabled={state.isLoading || !state.vehicleNumber}
            >
              {state.isLoading ? 'Booking...' : 'Book Now'}
            </Button>
            <Button
              className="secondary"
              onClick={handleClose}
              disabled={state.isLoading}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
  );
};

export default BookingModal;