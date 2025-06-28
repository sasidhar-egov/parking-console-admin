import React, { useState, useEffect } from 'react';
import { db } from '../db';
import { useAuth } from '../context/AuthContext';


const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuth();

  const fetchOrders = async () => {
    try {
      const userOrders = await db.bookings
        .where('userName')
        .equals(authUser.username)
        .reverse()
        .toArray();
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.username) {
      fetchOrders();
    }
  }, [authUser]);

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString();
  };

  const calculateDuration = (entryTime, exitTime) => {
    if (!exitTime) return 'Ongoing';
    
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diffMs = exit - entry;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading your orders...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>My Parking Orders</Title>
      
      {orders.length === 0 ? (
        <TableContainer>
          <EmptyState>
            <EmptyIcon>🚗</EmptyIcon>
            <EmptyMessage>No parking orders yet</EmptyMessage>
            <EmptySubtext>
              Your parking history will appear here once you book a slot.
            </EmptySubtext>
          </EmptyState>
        </TableContainer>
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Slot Number</TableHeaderCell>
                <TableHeaderCell>Vehicle Number</TableHeaderCell>
                <TableHeaderCell>Entry Time</TableHeaderCell>
                <TableHeaderCell>Exit Time</TableHeaderCell>
                <TableHeaderCell>Duration</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </tr>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>Slot {order.slotId}</TableCell>
                  <TableCell>{order.vehicleNumber}</TableCell>
                  <TableCell>{formatDateTime(order.entryTime)}</TableCell>
                  <TableCell>{formatDateTime(order.exitTime)}</TableCell>
                  <TableCell>{calculateDuration(order.entryTime, order.exitTime)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status}>
                      {order.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default CustomerOrders;