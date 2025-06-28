import React, { useReducer } from 'react';
import { db } from '../data/db';
import {
  Title,
  Form,
  InputGroup,
  Input,
  Button,
  LinkButton,
  ErrorMessage,
  SuccessMessage,
  LoginCard,
  ContainerCard
} from '../styles/StyledComponents';
import { useNavigate } from 'react-router-dom';
import { hashPassword } from '../utils/passwordEncryption'; // adjust path as needed

const initialState = {
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  error: '',
  success: '',
  loading: false
};

const forgotReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value, error: '' };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload, loading: false, error: '' };
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: '' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(forgotReducer, initialState);

  const handleInputChange = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const onSwitchToLogin = () => {
    navigate('/');
  };

  const validateForm = () => {
    if (!state.username.trim() || !state.phone.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Username and phone are required' });
      return false;
    }

    if (!state.password || state.password.length < 6) {
      dispatch({ type: 'SET_ERROR', payload: 'Password must be at least 6 characters' });
      return false;
    }

    if (state.password !== state.confirmPassword) {
      dispatch({ type: 'SET_ERROR', payload: 'Passwords do not match' });
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const matches = await db.users
        .where('username')
        .equals(state.username.toLowerCase())
        .toArray();
      if (matches.length===0) {
        dispatch({ type: 'SET_ERROR', payload: 'Username do not match' });
        return;
      }
      console.log(matches,"hiii");
      const user = matches.find(u => u.phone === state.phone);

      if (!user) {
        dispatch({ type: 'SET_ERROR', payload: 'Phone number do not match' });
        return;
      }


      const hashedPwd = await hashPassword(state.password);

      await db.users.update(user.id, { password: hashedPwd });

      dispatch({ type: 'SET_SUCCESS', payload: 'Password reset successful! Redirecting to login...' });

      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
    } catch (err) {
      console.error('Reset error:', err);
      dispatch({ type: 'SET_ERROR', payload: 'An error occurred. Please try again.' });
    }
  };

  return (
    <ContainerCard>
      <LoginCard>
        <Title>Reset Password</Title>
        {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
        {state.success && <SuccessMessage>{state.success}</SuccessMessage>}

        <Form>
          <InputGroup>
            <Input
              type="text"
              placeholder="Enter your username"
              value={state.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="tel"
              placeholder="Enter your phone number"
              value={state.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="New password"
              value={state.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Confirm password"
              value={state.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            />
          </InputGroup>

          <Button onClick={handleResetPassword} disabled={state.loading}>
            {state.loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <LinkButton onClick={onSwitchToLogin}>Back to Sign In</LinkButton>
        </div>
      </LoginCard>
    </ContainerCard>
  );
};

export default ForgotPassword;
