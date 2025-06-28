import Dexie from 'dexie';

export const db = new Dexie('RestaurantParkingDB');

db.version(1).stores({
  slots: '++id, number, occupied, &vehicleNumber, &userName, entryTime',
  bookings: '++id, slotId, slotNumber,vehicleNumber, userName, entryTime, exitTime, status,duration,amount',
  users: '++id, &username, &phone, name, role, password'
});

// Function to create dummy users for each user type
export const createDummyUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await db.users.count();
    if (existingUsers > 0) {
      console.log('Dummy users already exist');
      return;
    }

    // Dummy users data
    const dummyUsers = [
      // Admin user
      {
        username: 'admin',
        phone: '9876543210',
        name: 'Admin User',
        role: 'admin',
        password: 'admin123' // In real app, this should be hashed
      },
      
      // Staff user
      {
        username: 'staff1',
        phone: '9876543211',
        name: 'Staff Member',
        role: 'staff',
        password: 'staff123' // In real app, this should be hashed
      },
      
      // Customer users
      {
        username: 'customer1',
        phone: '9876543212',
        name: 'John Doe',
        role: 'customer',
        password: 'customer123' // In real app, this should be hashed
      },
      {
        username: 'customer2',
        phone: '9876543213',
        name: 'Jane Smith',
        role: 'customer',
        password: 'customer123' // In real app, this should be hashed
      },
      {
        username: 'customer3',
        phone: '9876543214',
        name: 'Mike Johnson',
        role: 'customer',
        password: 'customer123' // In real app, this should be hashed
      }
    ];

    // Add users to database
    await db.users.bulkAdd(dummyUsers);
    console.log('Dummy users created successfully:', dummyUsers.length);
    
    return dummyUsers;
  } catch (error) {
    console.error('Error creating dummy users:', error);
    throw error;
  }
};

// Function to create dummy parking slots
export const createDummySlots = async () => {
  try {
    // Check if slots already exist
    const existingSlots = await db.slots.count();
    if (existingSlots > 0) {
      console.log('Dummy slots already exist');
      return;
    }

    // Create 25 parking slots
    const dummySlots = [];
    for (let i = 1; i <= 25; i++) {
      dummySlots.push({
        number: `P${String(i).padStart(3, '0')}`, // P001, P002, etc.
        occupied: false,
        vehicleNumber: null,
        userName: null,
        entryTime: null
      });
    }

    // Add slots to database
    await db.slots.bulkAdd(dummySlots);
    console.log('Dummy slots created successfully:', dummySlots.length);
    
    return dummySlots;
  } catch (error) {
    console.error('Error creating dummy slots:', error);
    throw error;
  }
};

// Function to create some dummy bookings
export const createDummyBookings = async () => {
  try {
    // Check if bookings already exist
    const existingBookings = await db.bookings.count();
    if (existingBookings > 0) {
      console.log('Dummy bookings already exist');
      return;
    }

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const dummyBookings = [
      // Active booking for customer1
      {
        slotId: 5,
        slotNumber: 'P005',
        vehicleNumber: 'KA01MN1234',
        userName: 'customer1',
        entryTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        exitTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        status: 'active',
        duration: '4 hours',
        amount: 120
      },
      
      // Completed booking for customer1
      {
        slotId: 12,
        slotNumber: 'P012',
        vehicleNumber: 'KA02AB5678',
        userName: 'customer1',
        entryTime: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(yesterday.getTime() + 18 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        duration: '9 hours',
        amount: 270
      },
      
      // Cancelled booking for customer1
      {
        slotId: 8,
        slotNumber: 'P008',
        vehicleNumber: 'KA03CD9012',
        userName: 'customer1',
        entryTime: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(yesterday.getTime() + 16 * 60 * 60 * 1000).toISOString(),
        status: 'cancelled',
        duration: '2 hours',
        amount: 60
      },
      
      // Active booking for customer2
      {
        slotId: 15,
        slotNumber: 'P015',
        vehicleNumber: 'KA04EF3456',
        userName: 'customer2',
        entryTime: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        exitTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
        status: 'active',
        duration: '4 hours',
        amount: 120
      },
      
      // Completed booking for customer3
      {
        slotId: 20,
        slotNumber: 'P020',
        vehicleNumber: 'KA05GH7890',
        userName: 'customer3',
        entryTime: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000).toISOString(),
        exitTime: new Date(yesterday.getTime() + 15 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        duration: '5 hours',
        amount: 150
      }
    ];

    // Add bookings to database
    await db.bookings.bulkAdd(dummyBookings);
    
    // Update slots for active bookings
    await db.slots.update(5, { 
      occupied: true, 
      vehicleNumber: 'KA01MN1234', 
      userName: 'customer1',
      entryTime: dummyBookings[0].entryTime
    });
    
    await db.slots.update(15, { 
      occupied: true, 
      vehicleNumber: 'KA04EF3456', 
      userName: 'customer2',
      entryTime: dummyBookings[3].entryTime
    });

    console.log('Dummy bookings created successfully:', dummyBookings.length);
    
    return dummyBookings;
  } catch (error) {
    console.error('Error creating dummy bookings:', error);
    throw error;
  }
};

// Function to initialize all dummy data
export const initializeDummyData = async () => {
  try {
    console.log('Initializing dummy data...');
    
    await createDummyUsers();
    await createDummySlots();
    await createDummyBookings();
    
    console.log('All dummy data initialized successfully!');
    
    // Return summary
    const summary = {
      users: await db.users.count(),
      slots: await db.slots.count(),
      bookings: await db.bookings.count()
    };
    
    console.log('Database summary:', summary);
  } catch (error) {
    console.error('Error initializing dummy data:', error);
    throw error;
  }
};

export const clearAllData = async () => {
  try {
    await db.users.clear();
    await db.slots.clear();
    await db.bookings.clear();
    console.log('All data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};