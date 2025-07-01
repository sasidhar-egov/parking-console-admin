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
  id: number (auto-increment),
  username: string (unique),
  phone: string (unique),
  name: string,
  role: 'customer' | 'staff' | 'admin',
  password: string
}

// Slots Table
{
  id: number (auto-increment),
  number: string, // Format: P001, P002, etc.
  occupied: boolean,
  booked: boolean,
  vehicleNumber: string (unique when assigned),
  userName: string (unique when assigned),
  entryTime: string (ISO date)
}

// Bookings Table
{
  id: number (auto-increment),
  slotId: number,
  slotNumber: string,
  vehicleNumber: string,
  userName: string,
  bookingTime: string (ISO date),
  entryTime: string (ISO date),
  exitTime: string (ISO date),
  status: 'booked' | 'active' | 'completed' | 'cancelled',
  duration: string,
  amount: number
}
```

### **Key Design Decisions**

1. **Offline-First Approach**: Using IndexedDB ensures the application works without internet connectivity
2. **Component Architecture**: Modular component structure with clear separation of concerns
4. **Real-time Updates**: Polling mechanism to ensure UI reflects current slot status
5. **Role-Based Access Control**: Different interfaces for customers, staff, and admins

## 🚀 Setup & Installation

### **Prerequisites**
- Node.js (version 20 or higher)
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
   - The application will automatically create the IndexedDB database and populate it with dummy data on first run

### **Test Login Credentials**

The application comes with pre-configured test accounts. Use these credentials to test different user roles:

#### **Admin Account**
- **Username**: `admin`
- **Password**: `admin123`
- **Phone**: `9876543210`
- **Access**: Full system administration

#### **Staff Account**
- **Username**: `staff`
- **Password**: `staff123`
- **Phone**: `9876543211`
- **Access**: Vehicle entry/exit management

#### **Customer Accounts**
| Username | Password | Phone | Name |
|----------|----------|-------|------|
| `customer1` | `customer123` | `9876543212` | John Doe |
| `customer2` | `customer123` | `9876543213` | Jane Smith |
| `customer3` | `customer123` | `9876543214` | Mike Johnson |

> **Note**: All test credentials and dummy data are automatically created when you first run the application. Check the `src/data/db.js` file for complete dummy data setup including sample bookings and parking slot configurations.

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - The application will automatically create the IndexedDB database on first run

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

### **Core Behaviors**
- 🚫 **Slot Conflict Prevention**: Cannot book already occupied slots
- 🔒 **Authentication Required**: Only logged-in users can book slots
- 🚘 **Single Active Booking**: One active slot per vehicle/user
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
* If you are Using npm
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
* If you are Using Yarn
```bash
# Start development server
yarn dev

# Build for production
yarn build

# Run ESLint
yarn lint

# Preview production build
yarn preview
```


## 📞 Contact

If you have any questions or suggestions, please feel free to reach out:

- **Developer**: Sasidhar Jonna
- **Email**: jonna.sasi17@gmail.com


