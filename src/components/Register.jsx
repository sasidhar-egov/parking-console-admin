import React, { useReducer } from 'react';
import { db } from '../data/db';
import { hashPassword } from '../utils/passwordEncryption';
import {
    Title,
    Form,
    InputGroup,
    Input,
    Button,
    LinkButton,
    ErrorMessage,
    SuccessMessage,
    RoleGrid,
    RoleCard,
    RoleIcon,
    RoleLabel,
    ContainerCard,
    LoginCard
} from '../styles/StyledComponents';
import { useNavigate } from 'react-router-dom';

const initialState = {
    username: '',
    name: '',
    phone: '',
    role: 'customer',
    password: '',
    confirmPassword: '',
    error: '',
    success: '',
    loading: false
};

const registerReducer = (state, action) => {
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

const Register = () => {
    const navigate = useNavigate()
    const onSwitchToLogin = () => {
        navigate("/")
    }
    const [state, dispatch] = useReducer(registerReducer, initialState);

    const handleInputChange = (field, value) => {
        dispatch({ type: 'UPDATE_FIELD', field, value });
    };

    const validateForm = () => {
        if (!state.username.trim() || !state.name.trim() || !state.phone.trim()) {
            dispatch({ type: 'SET_ERROR', payload: 'Username, name, and phone are required' });
            return false;
        }

        if (state.password && state.password !== state.confirmPassword) {
            dispatch({ type: 'SET_ERROR', payload: 'Passwords do not match' });
            return false;
        }

        if (state.password && state.password.length < 6) {
            dispatch({ type: 'SET_ERROR', payload: 'Password must be at least 6 characters' });
            return false;
        }

        if (state.phone.length !== 10 || !/^\d+$/.test(state.phone)) {
            dispatch({ type: 'SET_ERROR', payload: 'Phone number must be 10 digits' });
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // Check if username already exists
            const existingUser = await db.users
                .where('username')
                .equals(state.username.toLowerCase())
                .first();

            if (existingUser) {
                dispatch({ type: 'SET_ERROR', payload: 'Username already exists' });
                return;
            }

            // Check if phone already exists
            const existingPhone = await db.users
                .where('phone')
                .equals(state.phone)
                .first();

            if (existingPhone) {
                dispatch({ type: 'SET_ERROR', payload: 'Phone number already registered' });
                return;
            }

            const userData = {
                username: state.username.toLowerCase(),
                name: state.name.trim(),
                phone: state.phone,
                role: state.role
            };

            if (state.password.trim()) {
                userData.password = await hashPassword(state.password);
            }

            await db.users.add(userData);

            dispatch({ type: 'SET_SUCCESS', payload: 'Registration successful! You can now login.' });
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Registration failed. Please try again.' });
        }
    };

    const roleOptions = [
        { value: 'customer', label: 'Customer', icon: '🚗' },
        { value: 'staff', label: 'Staff', icon: '👨‍💼' },
        { value: 'admin', label: 'Admin', icon: '👑' }
    ];

    return (
        <ContainerCard>
            <LoginCard>
            <Title>Create Account</Title>
            {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
            {state.success && <SuccessMessage>{state.success}</SuccessMessage>}

            <Form>
                <InputGroup>
                    <Input
                        type="text"
                        placeholder="Full Name *"
                        value={state.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                </InputGroup>

                <InputGroup>
                    <Input
                        type="text"
                        placeholder="Username *"
                        value={state.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                    />
                </InputGroup>

                <InputGroup>
                    <Input
                        type="tel"
                        placeholder="Phone Number (10 digits) *"
                        value={state.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        maxLength="10"
                    />
                </InputGroup>

                <div>
                    <label style={{ color: '#666', fontSize: '14px', marginBottom: '10px', display: 'block' }}>
                        Select Role:
                    </label>
                    <RoleGrid>
                        {roleOptions.map(option => (
                            <RoleCard
                                key={option.value}
                                selected={state.role === option.value}
                                onClick={() => handleInputChange('role', option.value)}
                            >
                                <RoleIcon>{option.icon}</RoleIcon>
                                <RoleLabel>{option.label}</RoleLabel>
                            </RoleCard>
                        ))}
                    </RoleGrid>
                </div>

                <InputGroup>
                    <Input
                        type="password"
                        placeholder="Password (optional, min 6 characters)"
                        value={state.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                </InputGroup>

                {state.password && (
                    <InputGroup>
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={state.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        />
                    </InputGroup>
                )}

                <Button onClick={handleRegister} disabled={state.loading}>
                    {state.loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <LinkButton onClick={onSwitchToLogin}>
                    Already have an account? Sign In
                </LinkButton>
            </div>
        </LoginCard>
        </ContainerCard>
    );
};

export default Register;