import React, { useReducer, useEffect } from 'react';
import { db } from '../../data/db';
import styled from 'styled-components';
import CustomerNavbarComponent from './CustomerNavbar';

// Styled Components with customer prefix
const CustomerOrdersContainer = styled.div`
  padding: 20px;
  background: linear-gradient(135deg,rgb(174, 174, 174) 0%,rgb(239, 235, 244) 100%);
  min-height: 100vh;
`;

const CustomerOrdersTitle = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: 0 2px 4px rgba(67, 64, 64, 0.3);
`;

const CustomerOrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const CustomerOrderCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
`;

const CustomerOrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
`;

const CustomerOrderSlot = styled.h3`
  color: #333;
  font-size: 1.3rem;
  margin: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CustomerOrderStatus = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'booked':
        return `
          background: #FF9800;
          color: white;
        `;
      case 'active':
        return `
          background: #4CAF50;
          color: white;
        `;
      case 'completed':
        return `
          background: #2196F3;
          color: white;
        `;
      case 'cancelled':
        return `
          background: #f44336;
          color: white;
        `;
      default:
        return `
          background: #9E9E9E;
          color: white;
        `;
    }
  }}
`;

const CustomerOrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const CustomerOrderDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomerOrderLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CustomerOrderValue = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 600;
`;

const CustomerOrderActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CustomerOrderButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  &.cancel {
    background: #f44336;
    color: white;
    &:hover {
      background: #d32f2f;
      transform: translateY(-1px);
    }
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const CustomerEmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const CustomerEmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
`;

const CustomerEmptyText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 10px;
  opacity: 0.8;
`;

const CustomerEmptySubtext = styled.p`
  font-size: 1rem;
  opacity: 0.6;
`;

const CustomerLoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: white;
  font-size: 1.2rem;
`;

// Reducer for managing orders state
const initialState = {
  orders: [],
  loading: true,
  error: null
};

const customerOrdersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CANCEL_ORDER':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload
            ? { ...order, status: 'cancelled' }
            : order
        )
      };
    default:
      return state;
  }
};

const CustomerOrdersPage = () => {
  const [state, dispatch] = useReducer(customerOrdersReducer, initialState);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await db.bookings
          .where('userName')
          .equals(localStorage.getItem("username"))
          .reverse()
          .toArray();
        console.log(orders,"hiiii");

        dispatch({ type: 'SET_ORDERS', payload: orders });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    };

    fetchOrders();
  },[]);

  const handleCancelOrder = async (orderId) => {
    try {
      const order = await db.bookings.get(orderId);
      if (!order) return;

      await db.bookings.update(orderId, { status: 'cancelled' });
      await db.slots.update(order.slotId, { vehicleNumber: null, userName: null, entryTime: null, occupied: false });
      console.log("hello");

      dispatch({ type: 'CANCEL_ORDER', payload: orderId });
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const formatDateTime = (dateString) => {
    if (dateString==null){
      return ""
    }
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (state.loading) {
    return (
      <>
        <CustomerOrdersContainer>
          <CustomerOrdersTitle>My Orders</CustomerOrdersTitle>
          <CustomerLoadingContainer>
            Loading your orders...
          </CustomerLoadingContainer>
        </CustomerOrdersContainer>
      </>
    );
  }

  if (state.orders.length === 0) {
    return (
      <>
        <CustomerOrdersContainer>
          <CustomerOrdersTitle>My Orders</CustomerOrdersTitle>
          <CustomerEmptyState>
            <CustomerEmptyIcon>🚗</CustomerEmptyIcon>
            <CustomerEmptyText>No parking orders yet</CustomerEmptyText>
            <CustomerEmptySubtext>Book a parking slot to see your orders here</CustomerEmptySubtext>
          </CustomerEmptyState>
        </CustomerOrdersContainer>
      </>
    );
  }

  return (
    <>
      <CustomerOrdersContainer>
        <CustomerOrdersTitle>My Orders</CustomerOrdersTitle>

        <CustomerOrdersGrid>
          {state.orders.map((order) => (
            <CustomerOrderCard key={order.id}>
              <CustomerOrderHeader>
                <CustomerOrderSlot>Slot {order.slotNumber}</CustomerOrderSlot>
                <CustomerOrderStatus status={order.status}>
                  {order.status}
                </CustomerOrderStatus>
              </CustomerOrderHeader>

              <CustomerOrderDetails>
                <CustomerOrderDetail>
                  <CustomerOrderLabel>Vehicle Number</CustomerOrderLabel>
                  <CustomerOrderValue>{order.vehicleNumber}</CustomerOrderValue>
                </CustomerOrderDetail>

                <CustomerOrderDetail>
                  <CustomerOrderLabel>Duration</CustomerOrderLabel>
                  <CustomerOrderValue>{order.duration}</CustomerOrderValue>
                </CustomerOrderDetail>
                <CustomerOrderDetail>
                  <CustomerOrderLabel>Booking Time</CustomerOrderLabel>
                  <CustomerOrderValue>{formatDateTime(order.bookingTime)}</CustomerOrderValue>
                </CustomerOrderDetail>

                <CustomerOrderDetail>
                  <CustomerOrderLabel>Entry Time</CustomerOrderLabel>
                  <CustomerOrderValue>{formatDateTime(order.entryTime)}</CustomerOrderValue>
                </CustomerOrderDetail>

                <CustomerOrderDetail>
                  <CustomerOrderLabel>Exit Time</CustomerOrderLabel>
                  <CustomerOrderValue>{formatDateTime(order.exitTime)}</CustomerOrderValue>
                </CustomerOrderDetail>

                <CustomerOrderDetail>
                  <CustomerOrderLabel>Amount</CustomerOrderLabel>
                  <CustomerOrderValue>₹{order.amount}</CustomerOrderValue>
                </CustomerOrderDetail>

                <CustomerOrderDetail>
                  <CustomerOrderLabel>Booking ID</CustomerOrderLabel>
                  <CustomerOrderValue>#{order.id.toString().padStart(4, '0')}</CustomerOrderValue>
                </CustomerOrderDetail>
              </CustomerOrderDetails>

              {/* Only show cancel button for 'booked' status */}
              {order.status === 'booked' && (
                <CustomerOrderActions>
                  <CustomerOrderButton
                    className="cancel"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Booking
                  </CustomerOrderButton>
                </CustomerOrderActions>
              )}
            </CustomerOrderCard>
          ))}
        </CustomerOrdersGrid>
      </CustomerOrdersContainer>
    </>
  );
};

export default CustomerOrdersPage;