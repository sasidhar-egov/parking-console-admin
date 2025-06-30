import React, { useReducer, useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../../data/db';
import AdminNavbar from './AdminNavBar';

const AdminSlotsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const AdminHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AdminTitle = styled.h2`
  color: #667eea;
  margin: 0;
`;

const AdminButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const AdminSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const AdminSlotCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid ${props => props.occupied ? '#dc3545' : '#28a745'};
  position: relative;
  transition: transform 0.3s ease;
  min-height:20vh;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const AdminSlotNumber = styled.h3`
  margin: 0 0 1rem 0;
  color: #667eea;
  font-size: 1.5rem;
`;

const AdminSlotStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const AdminStatusDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.occupied ? '#dc3545' : '#28a745'};
`;

const AdminSlotInfo = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const AdminDeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #c82333;
  }
`;

const AdminModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AdminModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  max-width: 90%;
`;

const AdminModalTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #667eea;
`;

const AdminInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  
  &:focus {
    border-color: #667eea;
    outline: none;
  }
`;

const AdminModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const AdminCancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
`;

const initialState = {
    slots: [],
    loading: true,
    error: null
};

const adminSlotsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_SLOTS':
            return { ...state, slots: action.payload, loading: false };
        case 'ADD_SLOT':
            return { ...state, slots: [...state.slots, action.payload] };
        case 'DELETE_SLOT':
            return { ...state, slots: state.slots.filter(slot => slot.id !== action.payload) };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

const AdminSlots = () => {

    const [state, dispatch] = useReducer(adminSlotsReducer, initialState);
    const [showModal, setShowModal] = useState(false);
    const [slotNumber, setSlotNumber] = useState('');

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const slots = await db.slots.orderBy('number').toArray();
            dispatch({ type: 'SET_SLOTS', payload: slots });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const handleAddSlot = async () => {
        if (!slotNumber.trim()) return;

        try {
            const existingSlot = await db.slots.where('number').equals(slotNumber).first();
            if (existingSlot) {
                alert('Slot number already exists!');
                return;
            }
            const newSlot = {
                number: slotNumber,
                occupied: false,
                vehicleNumber: null,
                userName: null,
                entryTime: null
            };

            const id = await db.slots.add(newSlot);
            dispatch({ type: 'ADD_SLOT', payload: { ...newSlot, id } });
            setShowModal(false);
            setSlotNumber('');
        } catch (error) {
            alert('Error adding slot: ' + error.message);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        try {
            const slot = await db.slots.get(slotId);

            if (!slot) {
                alert('Slot not found!');
                return;
            }

            if (slot.occupied) {
                alert('Cannot delete slot: A vehicle is currently parked in this slot.');
                return;
            }

            const confirmDelete = confirm('Are you sure you want to delete this slot?');
        if (!confirmDelete) return;
            await db.slots.delete(slotId);
            dispatch({ type: 'DELETE_SLOT', payload: slotId });
        } catch (error) {
            alert('Error deleting slot: ' + error.message);
        }
    };


    if (state.loading) {
        return (
            <>
                <AdminSlotsContainer>
                    <AdminTitle>Loading Slots...</AdminTitle>
                </AdminSlotsContainer>
            </>
        );
    }
    console.log(state.slots);
    return (
        <>
            <AdminSlotsContainer>

                <AdminHeader>
                    <AdminTitle>Slot Management</AdminTitle>
                    <AdminButton onClick={() => setShowModal(true)}>
                        Add New Slot
                    </AdminButton>
                </AdminHeader>

                <AdminSlotsGrid>
                    {state.slots.map(slot => (
                        <AdminSlotCard key={slot.id} occupied={slot.occupied}>
                            <AdminDeleteButton onClick={() => handleDeleteSlot(slot.id)}>
                                ×
                            </AdminDeleteButton>
                            <AdminSlotNumber>Slot #{slot.number}</AdminSlotNumber>
                            <AdminSlotStatus>
                                <AdminStatusDot occupied={slot.occupied} />
                                <span>{slot.occupied ? 'Occupied' : 'Available'}</span>
                            </AdminSlotStatus>
                            {slot.occupied && (
                                <>
                                    <AdminSlotInfo>Vehicle: {slot.vehicleNumber}</AdminSlotInfo>
                                    <AdminSlotInfo>User: {slot.userName}</AdminSlotInfo>
                                    <AdminSlotInfo>
                                        Entry: {new Date(slot.entryTime).toLocaleString()}
                                    </AdminSlotInfo>
                                </>
                            )}
                        </AdminSlotCard>
                    ))}
                </AdminSlotsGrid>

                {showModal && (
                    <AdminModal>
                        <AdminModalContent>
                            <AdminModalTitle>Add New Slot</AdminModalTitle>
                            <AdminInput
                                type="text"
                                placeholder="Slot Number"
                                value={slotNumber}
                                onChange={(e) => setSlotNumber(e.target.value)}
                            />
                            <AdminModalButtons>
                                <AdminCancelButton onClick={() => setShowModal(false)}>
                                    Cancel
                                </AdminCancelButton>
                                <AdminButton onClick={handleAddSlot}>
                                    Add Slot
                                </AdminButton>
                            </AdminModalButtons>
                        </AdminModalContent>
                    </AdminModal>
                )}
            </AdminSlotsContainer>
        </>
    );
};

export default AdminSlots;