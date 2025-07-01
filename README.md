# 🚗 Restaurant Vehicle Parking Console

A comprehensive React-based parking management system that allows restaurant staff to manage parking slots and enables customers to book parking spaces while visiting. The application uses IndexedDB for offline-first local storage and provides real-time parking slot management.

## 📋 Problem Statement

Restaurants need an efficient system to manage parking spaces for their customers. The system should:
- Allow customers to book available parking slots
- Enable staff to manage vehicle entries and exits
- Provide real-time visibility of parking slot availability
- Maintain historical records of all parking activities
- Work offline-first for reliability

## 🏗️ Project Architecture & Design Choices

### **Tech Stack**
- **Frontend**: React 19.1.0 with functional components and hooks
- **Routing**: React Router DOM 7.6.3 for navigation
- **Styling**: Styled Components 6.0.7 for component-based styling
- **Database**: Dexie.js 4.0.11 (IndexedDB wrapper) for local storage
- **Authentication**: bcryptjs 3.0.2 for password hashing
- **Build Tool**: Vite 7.0.0 for fast development and building

### **Application Modules**

#### 1. **Authentication System**
- User registration and login functionality
- Role-based access (Customer, Staff, Admin)
- Password encryption using bcryptjs
- Protected routes for different user roles

#### 2. **Parking Slot Management**
- Real-time grid/list view of all parking slots
- Visual status indicators (Available, Occupied, Reserved)
- Slot filtering and search capabilities

#### 3. **Vehicle Booking System**
- Customer booking interface
- One active slot per vehicle/user restriction
- Booking validation and confirmation

#### 4. **Staff Console**
- Vehicle entry and exit management
- Slot status updates
- Real-time parking overview

#### 5. **Admin Dashboard**
- Complete parking management console
- User management
- System configuration
- Analytics and reporting

#### 6. **Parking History**
- Comprehensive logging system
- Search by vehicle number or user
- Timestamped entry/exit records

### **Database Schema (IndexedDB)**

```javascript
// Users Table
{
  id: number,
  username: string,
  email: string,
  password: string (hashed),
  role: 'customer' | 'staff' | 'admin',
  createdAt: Date
}

// Parking Slots Table
{
  id: number,
  slotNumber: string,
  status: 'available' | 'occupied' | 'reserved',
  vehicleNumber: string,
  userId: number,
  bookedAt: Date,
  updatedAt: Date
}

// Parking History Table
{
  id: number,
  slotId: number,
  userId: number,
  vehicleNumber: string,
  action: 'entry' | 'exit',
  timestamp: Date,
  duration: number (minutes)
}
```

### **Key Design Decisions**

1. **Offline-First Approach**: Using IndexedDB ensures the application works without internet connectivity
2. **Component Architecture**: Modular component structure with clear separation of concerns
3. **State Management**: React Context API with useReducer for global state management
4. **Real-time Updates**: Polling mechanism to ensure UI reflects current slot status
5. **Role-Based Access Control**: Different interfaces for customers, staff, and admins

## 🚀 Setup & Installation

### **Prerequisites**
- Node.js (version 16 or higher)
- npm or yarn package manager

### **Installation Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/restaurant-parking-console.git
   cd restaurant-parking-console
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - The application will automatically create the IndexedDB database on first run

### **Build for Production**
```bash
npm run build
# or
yarn build
```

### **Preview Production Build**
```bash
npm run preview
# or
yarn preview
```

## 🧩 Application Features

### **Customer Features**
- ✅ User registration and login
- ✅ View available parking slots
- ✅ Book parking slots
- ✅ View booking history
- ✅ One active booking per user restriction

### **Staff Features**
- 🏢 Staff dashboard for parking management
- 🚗 Vehicle entry and exit processing
- 📊 Real-time slot status monitoring
- 📋 Customer booking management

### **Admin Features**
- 🔧 Complete system administration
- 👥 User management (customers and staff)
- 📈 Parking analytics and reports
- ⚙️ System configuration

### **Core Behaviors**
- 🚫 **Slot Conflict Prevention**: Cannot book already occupied slots
- 🔒 **Authentication Required**: Only logged-in users can book slots
- 🚘 **Single Active Booking**: One active slot per vehicle/user
- 📆 **Comprehensive Logging**: Timestamped records of all activities
- 🔄 **Real-time Updates**: Automatic UI updates using IndexedDB watchers
- 🖥️ **Admin Control**: Full management capabilities for administrators

## 📁 Project Structure

```
src/
├── components/
│   ├── AdminComponents/
│   │   ├── AdminSlots.jsx
│   │   ├── AdminStaff.jsx
│   │   └── AdminUsers.jsx
│   ├── CustomerComponents/
│   │   ├── CustomerBookingModal.jsx
│   │   ├── CustomerHome.jsx
│   │   ├── CustomerNavbar.jsx
│   │   └── CustomerOrders.jsx
│   ├── StaffComponents/
│   │   ├── StaffHomepage.jsx
│   │   ├── StaffNavBar.jsx
│   │   ├── VehicleEntry.jsx
│   │   └── VehicleExit.jsx
│   ├── CommonNotFound.jsx
│   ├── ForgetPassword.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── ProtectedRoute.jsx
│   └── Register.jsx
├── context/
│   └── [Context providers]
├── data/
│   └── db.jsx (Dexie database configuration)
├── styles/
│   └── StyledComponents.jsx
├── utils/
│   └── passwordEncryption.jsx
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## 🧪 Key Assumptions Made

1. **User Roles**: Three distinct user roles (Customer, Staff, Admin) with different access levels
2. **Slot Capacity**: Configurable number of parking slots (default: 50 slots)
3. **Booking Duration**: No automatic time-based slot release (manual exit required)
4. **Vehicle Identification**: Users provide vehicle number during booking
5. **Data Persistence**: All data stored locally using IndexedDB (no server dependency)
6. **Browser Support**: Modern browsers with IndexedDB support
7. **Network Independence**: Application designed to work offline-first

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```
# Start development server
yarn dev

# Build for production
yarn build

# Run ESLint
yarn lint

# Preview production build
yarn preview


## 📞 Contact

If you have any questions or suggestions, please feel free to reach out:

- **Developer**: Sasidhar Jonna
- **Email**: jonna.sasi17@gmail.com
