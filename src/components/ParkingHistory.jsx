// components/ParkingHistory.js
import React, { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { 
  Table, 
  Th, 
  Td, 
  StatusBadge, 
  Input, 
  FormGroup, 
  Label 
} from '../styles/StyledComponents';

const ParkingHistory = () => {
  const { state } = useParkingContext();
  const [searchTerm, setSearchTerm] = useState('');
  
  const calculateDuration = (entryTime, exitTime) => {
    if (!exitTime) return 'Active';
    
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diff = exit - entry;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  
  const filteredBookings = state.bookings.filter(booking => 
    booking.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedBookings = filteredBookings.sort((a, b) => 
    new Date(b.entryTime) - new Date(a.entryTime)
  );
  
  return (
    <div>
      <h3>Parking History</h3>
      
      <FormGroup style={{ maxWidth: '300px', marginBottom: '20px' }}>
        <Label>Search by Vehicle Number or User:</Label>
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </FormGroup>
      
      {sortedBookings.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          background: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <h4>No parking history found</h4>
          <p style={{ color: '#666' }}>
            {searchTerm ? 'No results match your search.' : 'No bookings have been made yet.'}
          </p>
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Vehicle Number</Th>
              <Th>User</Th>
              <Th>Slot</Th>
              <Th>Entry Time</Th>
              <Th>Exit Time</Th>
              <Th>Duration</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {sortedBookings.map(booking => {
              const slot = state.slots.find(s => s.id === booking.slotId);
              return (
                <tr key={booking.id}>
                  <Td><strong>{booking.vehicleNumber}</strong></Td>
                  <Td>{booking.userName}</Td>
                  <Td>{slot?.number}</Td>
                  <Td>{new Date(booking.entryTime).toLocaleString()}</Td>
                  <Td>
                    {booking.exitTime ? new Date(booking.exitTime).toLocaleString() : '-'}
                  </Td>
                  <Td>{calculateDuration(booking.entryTime, booking.exitTime)}</Td>
                  <Td>
                    <StatusBadge status={booking.status}>
                      {booking.status}
                    </StatusBadge>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ParkingHistory;