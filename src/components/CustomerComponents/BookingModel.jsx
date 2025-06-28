import React, { useState } from 'react';
import { db } from '../db';



const BookingModal = ({ slot, user, onSuccess, onClose }) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBooking = async () => {
    if (!vehicleNumber.trim()) {
      setError('Please enter vehicle number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if user already has an active booking
      const existingBooking = await db.bookings
        .where('userName')
        .equals(user.username)
        .and(booking => booking.status === 'active')
        .first();

      if (existingBooking) {
        setError('You already have an active booking. Please exit your current slot first.');
        setLoading(false);
        return;
      }

      // Check if vehicle already has an active booking
      const vehicleBooking = await db.bookings
        .where('vehicleNumber')
        .equals(vehicleNumber.toUpperCase())
        .and(booking => booking.status === 'active')
        .first();

      if (vehicleBooking) {
        setError('This vehicle already has an active booking.');
        setLoading(false);
        return;
      }

      // Double-check if slot is still available
      const currentSlot = await db.slots.get(slot.id);
      if (currentSlot.occupied) {
        setError('This slot has been occupied by another user. Please refresh and try again.');
        setLoading(false);
        return;
      }

      const currentTime = new Date();

      // Update slot as occupied
      await db.slots.update(slot.id, {
        occupied: true,
        vehicleNumber: vehicleNumber.toUpperCase(),
        userName: user.username,
        entryTime: currentTime
      });

      // Create booking record
      await db.bookings.add({
        slotId: slot.id,
        vehicleNumber: vehicleNumber.toUpperCase(),
        userName: user.username,
        entryTime: currentTime,
        exitTime: null,
        status: 'active'
      });

      onSuccess();
    } catch (error) {
      console.error('Error booking slot:', error);
      setError('Failed to book slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Title>Book Parking Slot</Title>
        
        <SlotInfo>
          <SlotNumber>Slot {slot.number}</SlotNumber>
          <div>Are you sure you want to book this slot?</div>
        </SlotInfo>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <FormGroup>
          <Label>Vehicle Number</Label>
          <Input
            type="text"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter your vehicle number"
            disabled={loading}
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton onClick={onClose} disabled={loading}>
            Cancel
          </CancelButton>
          <ConfirmButton onClick={handleBooking} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </ConfirmButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BookingModal;