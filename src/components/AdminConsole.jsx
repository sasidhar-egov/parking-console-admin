// components/AdminConsole.js
import React from 'react';
import { useParkingContext } from '../context/AuthContext';
import { StatsGrid, StatsCard } from '../styles/StyledComponents';
import ParkingHistory from './ParkingHistory';

const AdminConsole = () => {
  const { state } = useParkingContext();
  
  const occupiedCount = state.slots.filter(slot => slot.occupied).length;
  const availableCount = state.slots.length - occupiedCount;
  const activeBookings = state.bookings.filter(booking => booking.status === 'active').length;
  const completedBookings = state.bookings.filter(booking => booking.status === 'completed').length;
  
  const occupancyRate = ((occupiedCount / state.slots.length) * 100).toFixed(1);
  
  const currentlyParkedVehicles = state.slots.filter(slot => slot.occupied);
  
  return (
    <div>
      <h3>Admin Console</h3>
      
      <StatsGrid>
        <StatsCard bgColor="#3498db">
          <h4>Total Slots</h4>
          <div className="stat-number">{state.slots.length}</div>
        </StatsCard>
        
        <StatsCard bgColor="#e74c3c">
          <h4>Occupied</h4>
          <div className="stat-number">{occupiedCount}</div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {occupancyRate}% occupancy
          </div>
        </StatsCard>
        
        <StatsCard bgColor="#27ae60">
          <h4>Available</h4>
          <div className="stat-number">{availableCount}</div>
        </StatsCard>
        
        <StatsCard bgColor="#f39c12">
          <h4>Total Bookings</h4>
          <div className="stat-number">{state.bookings.length}</div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {activeBookings} active, {completedBookings} completed
          </div>
        </StatsCard>
      </StatsGrid>
      
      {/* Currently Parked Vehicles */}
      {currentlyParkedVehicles.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h4>Currently Parked Vehicles</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '15px',
            marginTop: '15px'
          }}>
            {currentlyParkedVehicles.map(slot => (
              <div key={slot.id} style={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Slot {slot.number}
                </div>
                <div style={{ color: '#666', marginTop: '5px' }}>
                  Vehicle: {slot.vehicleNumber}
                </div>
                <div style={{ color: '#666' }}>
                  User: {slot.userName}
                </div>
                <div style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                  Since: {new Date(slot.entryTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Parking History */}
      <ParkingHistory />
    </div>
  );
};

export default AdminConsole;