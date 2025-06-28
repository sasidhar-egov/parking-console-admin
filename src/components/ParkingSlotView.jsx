// components/ParkingSlotView.js
import React, { useState } from 'react';
import { useParkingContext } from '../context/AuthContext';
import { 
  ParkingGrid, 
  ParkingSlot, 
  FormContainer, 
  FormGroup, 
  Label, 
  Input, 
  Button 
} from '../styles/StyledComponents';

const ParkingSlotView = () => {
  const { state, dispatch } = useParkingContext();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  
  const handleSlotClick = (slot) => {
    if (!slot.occupied && state.currentUser) {
      setSelectedSlot(slot);
    }
  };
  
  const handleBooking = () => {
    if (selectedSlot && vehicleNumber && state.currentUser) {
      // Check if user already has an active booking
      const hasActiveBooking = state.bookings.some(
        booking => booking.userName === state.currentUser.name && booking.status === 'active'
      );
      
      if (hasActiveBooking) {
        alert('You already have an active parking slot!');
        return;
      }
      
      dispatch({
        type: 'BOOK_SLOT',
        payload: {
          slotId: selectedSlot.id,
          vehicleNumber: vehicleNumber.toUpperCase(),
          userName: state.currentUser.name
        }
      });
      setSelectedSlot(null);
      setVehicleNumber('');
      alert('Slot booked successfully!');
    }
  };
  
  return (
    <div>
      <h3>Parking Slots</h3>
      <ParkingGrid>
        {state.slots.map(slot => (
          <ParkingSlot 
            key={slot.id} 
            occupied={slot.occupied}
            onClick={() => handleSlotClick(slot)}
          >
            <div><strong>{slot.number}</strong></div>
            <div>{slot.occupied ? 'Occupied' : 'Available'}</div>
            {slot.occupied && <div><small>{slot.vehicleNumber}</small></div>}
          </ParkingSlot>
        ))}
      </ParkingGrid>
      
      {selectedSlot && (
        <FormContainer>
          <h4>Book Slot {selectedSlot.number}</h4>
          <FormGroup>
            <Label>Vehicle Number:</Label>
            <Input 
              type="text" 
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter vehicle number (e.g., KA01AB1234)"
            />
          </FormGroup>
          <Button onClick={handleBooking} disabled={!vehicleNumber.trim()}>
            Book Slot
          </Button>
          <Button onClick={() => setSelectedSlot(null)}>Cancel</Button>
        </FormContainer>
      )}
    </div>
  );
};

export default ParkingSlotView;