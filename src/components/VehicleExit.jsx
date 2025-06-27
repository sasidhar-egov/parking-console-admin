// components/VehicleExit.js
import React from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { Table, Th, Td, Button } from '../styles/StyledComponents';

const VehicleExit = () => {
  const { state, dispatch } = useParkingContext();
  const occupiedSlots = state.slots.filter(slot => slot.occupied);
  
  const handleExit = (slotId, vehicleNumber) => {
    const confirmExit = window.confirm(
      `Are you sure you want to mark vehicle ${vehicleNumber} as exited?`
    );
    
    if (confirmExit) {
      dispatch({ type: 'EXIT_VEHICLE', payload: { slotId } });
      alert('Vehicle exit recorded successfully!');
    }
  };
  
  const calculateDuration = (entryTime) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diff = now - entry;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <div>
      <h3>Vehicle Exit Management</h3>
      {occupiedSlots.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          background: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <h4>No vehicles currently parked</h4>
          <p style={{ color: '#666' }}>All parking slots are available.</p>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Slot</Th>
              <Th>Vehicle Number</Th>
              <Th>User</Th>
              <Th>Entry Time</Th>
              <Th>Duration</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {occupiedSlots.map(slot => (
              <tr key={slot.id}>
                <Td><strong>{slot.number}</strong></Td>
                <Td>{slot.vehicleNumber}</Td>
                <Td>{slot.userName}</Td>
                <Td>{new Date(slot.entryTime).toLocaleString()}</Td>
                <Td>{calculateDuration(slot.entryTime)}</Td>
                <Td>
                  <Button 
                    onClick={() => handleExit(slot.id, slot.vehicleNumber)}
                    style={{ background: '#e74c3c' }}
                  >
                    Mark Exit
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default VehicleExit;