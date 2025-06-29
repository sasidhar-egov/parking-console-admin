import React, { useState } from 'react';
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5rem;
`;

const ModalText = styled.p`
  color: #666;
  margin-bottom: 25px;
  font-size: 16px;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: bold;
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
`;

const ErrorMessage = styled.p`
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 12px 24px;
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
`;

const BookingModal = ({ 
  isOpen, 
  selectedSlot, 
  onClose, 
  onBookingSuccess 
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const existingBooking = await db.bookings
        .where('vehicleNumber')
        .equals(vehicleNumber.trim().toUpperCase())
        .and(booking => booking.status === 'Active')
        .first();
      console.log(existingBooking,"hiiiiiii");
      return existingBooking !== undefined;
    } catch (error) {
      console.error('Error checking vehicle:', error);
      return false;
    }
  };

  const handleBookSlot = async () => {
    const trimmedVehicleNumber = vehicleNumber.trim().toUpperCase();
    
    // Validate vehicle number
    const validationError = validateVehicleNumber(trimmedVehicleNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if vehicle is already parked
      const isAlreadyParked = await checkIfVehicleAlreadyParked(trimmedVehicleNumber);
      if (isAlreadyParked) {
        setError('This vehicle is already parked. Please exit first.');
        setIsLoading(false);
        return;
      }

      // Get username from localStorage
      const username = localStorage.getItem('username');
      console.log(username,"hleo");

      const now = new Date().toISOString();

      // Update slot
      await db.slots.update(selectedSlot.id, {
        occupied: true,
        vehicleNumber: trimmedVehicleNumber,
        userName: username,
        entryTime: now
      });
      debugger
      // Create booking
      await db.bookings.add({
        slotId: selectedSlot.id,
        slotNumber: selectedSlot.number,
        vehicleNumber: trimmedVehicleNumber,
        userName: username,
        entryTime: now,
        exitTime: null,
        status: 'booked',
        duration: null,
        amount: null
      });

      // Call success callback
      if (onBookingSuccess) {
        onBookingSuccess(selectedSlot.id);
      }

      // Reset form and close modal
      setVehicleNumber('');
      setError('');
      onClose();
    } catch (error) {
      console.error('Booking failed:', error);
      setError('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setVehicleNumber('');
    setError('');
    onClose();
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
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter vehicle number (e.g., KA01AB1234)"
            className={error ? 'error' : ''}
            disabled={isLoading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputGroup>

        <ButtonGroup>
          <Button 
            className="primary" 
            onClick={handleBookSlot}
            disabled={isLoading}
          >
            {isLoading ? 'Booking...' : 'Book Now'}
          </Button>
          <Button 
            className="secondary" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default BookingModal;