# Parking Management System - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Database API](#database-api)
3. [Utility Functions](#utility-functions)
4. [Core Components](#core-components)
5. [Authentication Components](#authentication-components)
6. [Customer Components](#customer-components)
7. [Staff Components](#staff-components)
8. [Admin Components](#admin-components)
9. [Routing and Navigation](#routing-and-navigation)
10. [Usage Examples](#usage-examples)

## Overview

This is a React-based parking management system built with:
- **Frontend**: React 19.1.0 with React Router DOM for navigation
- **Database**: Dexie (IndexedDB wrapper) for client-side data storage
- **Styling**: Styled Components for CSS-in-JS styling
- **Authentication**: Role-based access control (Customer, Staff, Admin)
- **Build Tool**: Vite for development and production builds

## Database API

### Database Schema

The application uses Dexie to manage three main tables:

```javascript
// Database instance
export const db = new Dexie('RestaurantParkingDB');

db.version(1).stores({
  slots: '++id, number, occupied, booked, &vehicleNumber, &userName, entryTime',
  bookings: '++id, slotId, slotNumber, vehicleNumber, userName, bookingTime, entryTime, exitTime, status, duration, amount',
  users: '++id, &username, &phone, name, role, password'
});
```

### Database Functions

#### `createDummyUsers()`
Creates initial demo users for all role types.

**Usage:**
```javascript
import { createDummyUsers } from './data/db';

await createDummyUsers();
```

**Default Users Created:**
- **Admin**: username: `admin`, password: `admin123`
- **Staff**: username: `staff`, password: `staff123`
- **Customers**: username: `customer1`, `customer2`, `customer3`, password: `customer123`

#### `createDummySlots()`
Creates 25 parking slots (P001 to P025).

**Usage:**
```javascript
import { createDummySlots } from './data/db';

await createDummySlots();
```

**Slot Structure:**
```javascript
{
  number: 'P001',        // Slot identifier
  occupied: false,       // Is vehicle currently parked
  booked: false,         // Is slot reserved
  vehicleNumber: null,   // Vehicle number if occupied/booked
  userName: null,        // Username who booked/occupied
  entryTime: null        // Entry timestamp
}
```

#### `createDummyBookings()`
Creates sample booking records with various statuses.

**Usage:**
```javascript
import { createDummyBookings } from './data/db';

await createDummyBookings();
```

**Booking Structure:**
```javascript
{
  slotId: 1,                    // Reference to slot
  slotNumber: 'P001',           // Slot identifier
  vehicleNumber: 'KA01AB1234',  // Vehicle registration
  userName: 'customer1',        // Customer username
  bookingTime: '2024-01-01T10:00:00.000Z',
  entryTime: '2024-01-01T10:15:00.000Z',
  exitTime: '2024-01-01T14:00:00.000Z',
  status: 'completed',          // 'booked', 'completed', 'cancelled'
  duration: '4 hours',          // Parking duration
  amount: 120                   // Total amount paid
}
```

#### `initializeDummyData()`
Initializes all dummy data if database is empty.

**Usage:**
```javascript
import { initializeDummyData } from './data/db';

await initializeDummyData();
```

#### `clearAllData()`
Clears all data from all tables.

**Usage:**
```javascript
import { clearAllData } from './data/db';

await clearAllData();
```

## Utility Functions

### Password Encryption (`src/utils/passwordEncryption.jsx`)

#### `hashPassword(password)`
Hashes a plain text password using bcrypt.

**Parameters:**
- `password` (string): Plain text password to hash

**Returns:**
- Promise<string>: Hashed password

**Usage:**
```javascript
import { hashPassword } from './utils/passwordEncryption';

const hashedPassword = await hashPassword('myPassword123');
```

#### `comparePassword(password, hashedPassword)`
Compares plain text password with hashed password.

**Parameters:**
- `password` (string): Plain text password
- `hashedPassword` (string): Previously hashed password

**Returns:**
- Promise<boolean>: True if passwords match

**Usage:**
```javascript
import { comparePassword } from './utils/passwordEncryption';

const isValid = await comparePassword('myPassword123', hashedPassword);
```

## Core Components

### App Component (`src/App.jsx`)

Main application component that sets up routing and initializes dummy data.

**Features:**
- Sets up React Router with role-based protected routes
- Initializes database with dummy data on first load
- Defines route structure for all user roles

**Usage:**
```jsx
import App from './App';

// App component is the root component
<App />
```

## Authentication Components

### Login Component (`src/components/Login.jsx`)

Handles user authentication with username/password.

**Features:**
- Form validation
- Password comparison using bcrypt
- Role-based redirection after login
- Loading states and error handling
- Keyboard navigation support

**State Management:**
Uses `useReducer` with the following state structure:
```javascript
{
  username: '',
  password: '',
  error: '',
  success: '',
  loading: false
}
```

**Usage:**
```jsx
import Login from './components/Login';

<Login />
```

### Register Component (`src/components/Register.jsx`)

Handles new user registration.

**Features:**
- Form validation for all required fields
- Phone number validation
- Username uniqueness checking
- Password hashing before storage
- Customer role assignment by default

**Required Fields:**
- Name
- Username (unique)
- Phone number (10 digits)
- Password (minimum 6 characters)

### ForgetPassword Component (`src/components/ForgetPassword.jsx`)

Allows users to reset their password using phone number verification.

**Features:**
- Phone number verification
- New password setting
- Form validation
- Secure password update

### ProtectedRoute Component (`src/components/ProtectedRoute.jsx`)

Higher-order component that protects routes based on user roles.

**Props:**
- `allowedRole` (string): Required role for accessing the route

**Features:**
- Checks localStorage for authentication
- Role-based access control
- Automatic redirection for unauthorized access
- Renders appropriate navbar based on user role

**Usage:**
```jsx
<Route element={<ProtectedRoute allowedRole="customer" />}>
  <Route path="/customer/home" element={<CustomerHome />} />
</Route>
```

## Customer Components

### CustomerHome Component (`src/components/CustomerComponents/CustomerHome.jsx`)

Main dashboard for customers to view and book parking slots.

**Features:**
- Real-time slot availability display
- Slot booking functionality
- Booking status indicators
- Responsive grid layout

### CustomerBookingModel Component (`src/components/CustomerComponents/CustomerBookingModel.jsx`)

Modal component for booking parking slots.

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `selectedSlot` (object): Slot object to be booked
- `onClose` (function): Callback when modal is closed
- `onBookingSuccess` (function): Callback when booking succeeds

**Features:**
- Vehicle number validation
- Duplicate booking prevention
- Loading states
- Error handling
- Responsive design

**Usage:**
```jsx
<BookingModal
  isOpen={isModalOpen}
  selectedSlot={selectedSlot}
  onClose={handleCloseModal}
  onBookingSuccess={handleBookingSuccess}
/>
```

**Vehicle Number Validation:**
- Must be at least 3 characters
- Converted to uppercase
- Checked for existing bookings

### CustomerOrders Component (`src/components/CustomerComponents/CustomerOrders.jsx`)

Displays customer's booking history and current bookings.

**Features:**
- Booking history with status filtering
- Real-time status updates
- Booking details display
- Cancel booking functionality

### CustomerNavbar Component (`src/components/CustomerComponents/CustomerNavbar.jsx`)

Navigation bar for customer pages.

**Features:**
- Navigation links to customer pages
- User information display
- Logout functionality

## Staff Components

### StaffHomepage Component (`src/components/StaffComponents/StaffHomepage.jsx`)

Main dashboard for staff members.

**Features:**
- Current parking overview
- Recent activity display
- Quick access to entry/exit functions

### VehicleEntry Component (`src/components/StaffComponents/VehicleEntry.jsx`)

Handles vehicle entry process for staff.

**Features:**
- Vehicle number input and validation
- Booking verification
- Slot assignment
- Entry time recording
- Booking status updates

**Validation Rules:**
- Vehicle must have valid booking
- Booking must be within time limit (20 minutes)
- Slot must be available

### VehicleExit Component (`src/components/StaffComponents/VehicleExit.jsx`)

Handles vehicle exit process and payment calculation.

**Features:**
- Vehicle lookup by number
- Duration calculation
- Payment amount calculation
- Slot release
- Booking completion

**Payment Rates:**
- Base rate: ₹30 per hour
- Calculated based on entry/exit time difference

### StaffNavBar Component (`src/components/StaffComponents/StaffNavBar.jsx`)

Navigation bar for staff pages.

## Admin Components

### AdminHomepage Component (`src/components/AdminComponents/AdminHomepage.jsx`)

Main dashboard for administrators.

**Features:**
- System overview statistics
- Recent bookings summary
- Quick access to management functions

### AdminSlots Component (`src/components/AdminComponents/AdminSlots.jsx`)

Manage parking slots.

**Features:**
- View all slots with current status
- Add/remove parking slots
- Update slot information
- Force release occupied slots

### AdminBookings Component (`src/components/AdminComponents/AdminBookings.jsx`)

Manage all bookings in the system.

**Features:**
- View all bookings with filtering
- Update booking status
- Search by vehicle number or customer
- Export booking data

### AdminUSers Component (`src/components/AdminComponents/AdminUSers.jsx`)

Manage system users.

**Features:**
- View all users by role
- Add new users
- Update user information
- Deactivate/activate users
- Role management

### AdminStaff Component (`src/components/AdminComponents/AdminStaff.jsx`)

Manage staff members specifically.

**Features:**
- Staff member listing
- Staff registration
- Staff information updates
- Activity monitoring

### AdminNavBar Component (`src/components/AdminComponents/AdminNavBar.jsx`)

Navigation bar for admin pages.

## Routing and Navigation

### Route Structure

```
/ (Login)
├── /register
├── /forget-password
├── /customer/* (Protected - Customer Role)
│   ├── /home
│   ├── /orders
│   └── /* (CommonNotFound)
├── /staff/* (Protected - Staff Role)
│   ├── /home
│   ├── /vehicle-entry
│   ├── /vehicle-exit
│   └── /* (CommonNotFound)
└── /admin/* (Protected - Admin Role)
    ├── /home
    ├── /staff
    ├── /slots
    ├── /bookings
    ├── /users
    └── /* (CommonNotFound)
```

### Navigation Components

- **CustomerNavbar**: Home, Orders, Logout
- **StaffNavBar**: Home, Vehicle Entry, Vehicle Exit, Logout
- **AdminNavBar**: Home, Staff, Slots, Bookings, Users, Logout

## Usage Examples

### Basic Application Setup

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### User Authentication Flow

```javascript
// Login process
const handleLogin = async (username, password) => {
  try {
    const user = await db.users
      .where('username')
      .equals(username.toLowerCase())
      .first();
    
    if (user && await comparePassword(password, user.password)) {
      localStorage.setItem('username', user.username);
      localStorage.setItem('role', user.role);
      // Redirect to role-specific home page
      navigate(`/${user.role}/home`);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Booking a Parking Slot

```javascript
// Customer booking process
const bookSlot = async (slotId, vehicleNumber) => {
  try {
    const username = localStorage.getItem('username');
    const now = new Date().toISOString();
    
    // Update slot status
    await db.slots.update(slotId, {
      booked: true,
      vehicleNumber: vehicleNumber.toUpperCase(),
      userName: username,
      entryTime: now
    });
    
    // Create booking record
    await db.bookings.add({
      slotId,
      slotNumber: slot.number,
      vehicleNumber: vehicleNumber.toUpperCase(),
      userName: username,
      bookingTime: now,
      status: 'booked'
    });
  } catch (error) {
    console.error('Booking failed:', error);
  }
};
```

### Vehicle Entry (Staff)

```javascript
// Staff processing vehicle entry
const processEntry = async (vehicleNumber) => {
  try {
    // Find booking
    const booking = await db.bookings
      .where('vehicleNumber')
      .equals(vehicleNumber.toUpperCase())
      .and(b => b.status === 'booked')
      .first();
    
    if (booking) {
      const now = new Date().toISOString();
      
      // Update booking
      await db.bookings.update(booking.id, {
        entryTime: now,
        status: 'active'
      });
      
      // Update slot
      await db.slots.update(booking.slotId, {
        occupied: true,
        entryTime: now
      });
    }
  } catch (error) {
    console.error('Entry processing failed:', error);
  }
};
```

### Database Queries

```javascript
// Get available slots
const getAvailableSlots = async () => {
  return await db.slots
    .where('occupied')
    .equals(false)
    .and(slot => !slot.booked)
    .toArray();
};

// Get user bookings
const getUserBookings = async (username) => {
  return await db.bookings
    .where('userName')
    .equals(username)
    .reverse()
    .toArray();
};

// Get active bookings (Admin view)
const getActiveBookings = async () => {
  return await db.bookings
    .where('status')
    .anyOf(['booked', 'active'])
    .toArray();
};
```

### Error Handling

```javascript
// Standard error handling pattern
const handleDatabaseOperation = async () => {
  try {
    // Database operation
    const result = await db.table.operation();
    return result;
  } catch (error) {
    console.error('Database operation failed:', error);
    
    // User-friendly error message
    if (error.message.includes('ConstraintError')) {
      throw new Error('This record already exists');
    } else {
      throw new Error('Operation failed. Please try again.');
    }
  }
};
```

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **Role-Based Access**: Routes are protected based on user roles
3. **Input Validation**: All user inputs are validated before processing
4. **Local Storage**: Authentication tokens stored in localStorage (consider sessionStorage for enhanced security)

## Performance Optimization

1. **Lazy Loading**: Components can be loaded on-demand using React.lazy()
2. **Database Indexing**: Dexie automatically creates indexes for marked fields (&fieldName)
3. **State Management**: useReducer used for complex state management in components

## Browser Compatibility

- **IndexedDB Support**: Required for database functionality
- **Modern Browsers**: Chrome 61+, Firefox 60+, Safari 10.1+, Edge 79+
- **Mobile Support**: Responsive design for mobile devices

This documentation provides comprehensive coverage of all public APIs, functions, and components in the parking management system. Each section includes practical examples and usage instructions to help developers understand and extend the application.