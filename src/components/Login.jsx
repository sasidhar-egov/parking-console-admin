import React, { useReducer } from 'react';
import { db } from '../data/db';
import { comparePassword } from '../utils/passwordEncryption';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  Container
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
  const { login } = useAuth();

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
        console.log("usernjfjhhj",state.password,user.password);

      const isPasswordValid = await comparePassword(state.password, user.password);

      if (!isPasswordValid) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid username or password' });
        return;
      }

      login({
        username: user.username,
        name: user.name,
        role: user.role,
      });
      localStorage.setItem("username",user.username)

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

  return (
    <ContainerCard>
      <LoginCard>
        <Title>Welcome Back</Title>
        {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
        {state.success && <SuccessMessage>{state.success}</SuccessMessage>}

        <Form>
          <InputGroup>
            <Input
              type="text"
              placeholder="Username"
              value={state.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="password"
              placeholder="Password"
              value={state.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </InputGroup>

          <Button onClick={handleLogin} disabled={state.loading}>
            {state.loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <LinkButton onClick={onSwitchToForgot}>
            Forgot Password?
          </LinkButton>
          <br />
          <LinkButton onClick={onSwitchToRegister}>
            Don't have an account? Register
          </LinkButton>
        </div>
      </LoginCard>
    </ContainerCard>
  );
};

export default Login;