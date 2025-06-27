// App.js
import React, { useState } from 'react';
import { ParkingProvider, useParkingContext } from './context/ParkingContext';
import Login from './components/Login';
import ParkingSlotView from './components/ParkingSlotView';
import VehicleExit from './components/VehicleExit';
import ParkingHistory from './components/ParkingHistory';
import AdminConsole from './components/AdminConsole';
import { AppContainer, Header, NavBar, NavButton } from './styles/StyledComponents';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('slots');
  const { state, dispatch } = useParkingContext();
  
  const handleLogin = (user) => {
    dispatch({ type: 'SET_USER', payload: user });
  };
  
  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    setActiveTab('slots');
  };
  
  const renderContent = () => {
    switch(activeTab) {
      case 'slots':
        return <ParkingSlotView />;
      case 'exit':
        return <VehicleExit />;
      case 'history':
        return <ParkingHistory />;
      case 'admin':
        return <AdminConsole />;
      default:
        return <ParkingSlotView />;
    }
  };
  
  return (
    <AppContainer>
      <Header>
        <h1>🚗 Restaurant Vehicle Parking Console</h1>
        {state.currentUser && (
          <p>Welcome, {state.currentUser.name}! 
            <button 
              onClick={handleLogout}
              style={{ 
                marginLeft: '10px', 
                padding: '5px 10px', 
                border: 'none', 
                borderRadius: '4px', 
                background: '#e74c3c', 
                color: 'white', 
                cursor: 'pointer' 
              }}
            >
              Logout
            </button>
          </p>
        )}
      </Header>
      
      {!state.currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <NavBar>
            <NavButton 
              active={activeTab === 'slots'} 
              onClick={() => setActiveTab('slots')}
            >
              Parking Slots
            </NavButton>
            <NavButton 
              active={activeTab === 'exit'} 
              onClick={() => setActiveTab('exit')}
            >
              Vehicle Exit
            </NavButton>
            <NavButton 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')}
            >
              Parking History
            </NavButton>
            <NavButton 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')}
            >
              Admin Console
            </NavButton>
          </NavBar>
          
          {renderContent()}
        </>
      )}
    </AppContainer>
  );
};

const App = () => {
  return (
    <ParkingProvider>
      <AppContent />
    </ParkingProvider>
  );
};

export default App;