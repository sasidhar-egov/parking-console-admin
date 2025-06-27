// components/Login.js
import React, { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import { FormContainer, FormGroup, Label, Input, Button } from '../styles/StyledComponents';

const Login = ({ onLogin }) => {
  const [phone, setPhone] = useState('');
  const { state } = useParkingContext();
  
  const handleLogin = () => {
    const user = state.users.find(u => u.phone === phone);
    if (user) {
      onLogin(user);
    } else {
      alert('User not found');
    }
  };
  
  return (
    <FormContainer>
      <h3>Login</h3>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
        Demo phones: 9876543210 (John Doe) or 9876543211 (Jane Smith)
      </p>
      <FormGroup>
        <Label>Phone Number:</Label>
        <Input 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </FormGroup>
      <Button onClick={handleLogin}>Login</Button>
    </FormContainer>
  );
};

export default Login;