import React, { useReducer } from 'react';
import { db } from '../data/db';
import { comparePassword } from '../utils/passwordEncryption';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Title,
  Form,
  InputGroup,
  Input,
  LoginCard,
  ContainerCard,
  Button,
  LinkButton,
  ErrorMessage,
  SuccessMessage,
} from '../styles/StyledComponents';

const initialState = {
  username: '',
  password: '',
  error: '',
  success: '',
  loading: false
};

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        error: ''
      };
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

const Login = () => {

  const navigate = useNavigate()
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const handleInputChange = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const onSwitchToForgot = () => {
    navigate("/forget-password")

  }

  const onSwitchToRegister = () => {
    navigate("/register");
  }

  const validateForm = () => {
    if (!state.username.trim() || !state.password.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Username and password are required' });
      return false;
    }
    return true;
  };
  const onSwitchToHome = (role) => {
    navigate(`/${role}/home`)
  }
  const handleLogin = async () => {
    if (!validateForm()) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const user = await db.users
        .where('username')
        .equals(state.username.toLowerCase())
        .first();
      if (!user) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid username or password' });
        return;
      }

      // Check if password exists and compare
      if (!user.password) {
        dispatch({ type: 'SET_ERROR', payload: 'Password not set for this account. Please contact admin.' });
        return;
      }

      const isPasswordValid = await comparePassword(state.password, user.password);

      if (!isPasswordValid) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid username or password' });
        return;
      }


      localStorage.setItem("username", user.username)
      localStorage.setItem("role", user.role)

      dispatch({ type: 'SET_SUCCESS', payload: `Welcome back, ${user.name}!` });
      setTimeout(() => {
        onSwitchToHome(user.role);
      }, 3000);
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Login failed. Please try again.' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  if (username && role) {
    return <Navigate to={`/${role}/home`} replace />;
  }
  return (
    <ContainerCard>
      <LoginCard role="main">
        <Title>Welcome Back</Title>
        {state.error && (
          <ErrorMessage role="alert" aria-live="polite">
            {state.error}
          </ErrorMessage>
        )}
        {state.success && (
          <SuccessMessage role="status" aria-live="polite">
            {state.success}
          </SuccessMessage>
        )}

        <Form>
          <InputGroup>
              <Input
              id="username"
              type="text"
              placeholder="Username"
              value={state.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onKeyPress={handleKeyPress}
              aria-required="true"
              aria-invalid={state.error ? 'true' : 'false'}
              aria-describedby={state.error ? 'error-message' : undefined}
            />
          </InputGroup>

          <InputGroup>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={state.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyDown={handleKeyPress}
              aria-required="true"
              aria-invalid={state.error ? 'true' : 'false'}
              aria-describedby={state.error ? 'error-message' : undefined}
            />
          </InputGroup>

          <Button
            onClick={handleLogin}
            disabled={state.loading}
            aria-describedby={state.loading ? 'loading-status' : undefined}
          >
            {state.loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <nav style={{ textAlign: 'center', marginTop: '20px' }} aria-label="Account options">
          <LinkButton onClick={onSwitchToForgot} aria-label="Go to forgot password page">
            Forgot Password?
          </LinkButton>
          <br />
          <LinkButton onClick={onSwitchToRegister} aria-label="Go to registration page">
            Don't have an account? Register
          </LinkButton>
        </nav>
      </LoginCard>
    </ContainerCard>
  );
};

export default Login;