import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../db';
import { useAuth } from '../context/AuthContext';
import BookingModal from './BookingModal';



const CustomerHome = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState('');
  const { authUser } = useAuth();

  const fetchSlots = async () => {
    try {
      const allSlots = await db.slots.toArray();
      setSlots(allSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSlotClick = (slot) => {
    if (slot.occupied) return;
    
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleBookingSuccess = () => {
    setShowModal(false);
    setSelectedSlot(null);
    setNotification('Slot booked successfully! 🎉');
    fetchSlots(); // Refresh slots
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading parking slots...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Available Parking Slots</Title>
      
      <SlotsGrid>
        {slots.map((slot) => (
          <SlotCard
            key={slot.id}
            occupied={slot.occupied}
            onClick={() => handleSlotClick(slot)}
          >
            <SlotNumber occupied={slot.occupied}>
              Slot {slot.number}
            </SlotNumber>
            <SlotStatus occupied={slot.occupied}>
              {slot.occupied ? '🚫 Occupied' : '✅ Available'}
            </SlotStatus>
            {slot.occupied && (
              <VehicleInfo>
                <div>Vehicle: {slot.vehicleNumber}</div>
                <div>User: {slot.userName}</div>
              </VehicleInfo>
            )}
          </SlotCard>
        ))}
      </SlotsGrid>

      {showModal && (
        <BookingModal
          slot={selectedSlot}
          user={authUser}
          onSuccess={handleBookingSuccess}
          onClose={handleModalClose}
        />
      )}

      {notification && (
        <NotificationContainer>
          <Notification>{notification}</Notification>
        </NotificationContainer>
      )}
    </Container>
  );
};

export default CustomerHome;