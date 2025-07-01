import Dexie from 'dexie';

export const db = new Dexie('RestaurantParkingDB');

db.version(1).stores({
  slots: '++id, number, occupied, booked, &vehicleNumber, &userName, entryTime',
  bookings: '++id, slotId, slotNumber, vehicleNumber, userName, bookingTime, entryTime, exitTime, status, duration, amount',
  users: '++id, &username, &phone, name, role, password'
});

// Function to create dummy users for each user type
export const createDummyUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await db.users.count();
    if (existingUsers > 0) {
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
        username: 'staff',
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
      return;
    }

    // Create 25 parking slots
    const dummySlots = [];
    for (let i = 1; i <= 25; i++) {
      dummySlots.push({
        number: `P${String(i).padStart(3, '0')}`, // P001, P002, etc.
        occupied: false,
        booked: false,
        vehicleNumber: null,
        userName: null,
        entryTime: null
      });
    }

    // Add slots to database
    await db.slots.bulkAdd(dummySlots);
    
    return dummySlots;
  } catch (error) {
    console.error('Error creating dummy slots:', error);
    throw error;
  }
};

// Function to create some dummy bookings
export const createDummyBookings = async () => {
  const existingBookings = await db.bookings.count();
  if (existingBookings > 0) return;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const dummyBookings = [
    // Active booking - booked 10 min ago, entered 5 min later (within 20 min limit)
    {
      slotId: 5,
      slotNumber: 'P005',
      vehicleNumber: 'KA01MN1234',
      userName: 'customer1',
      bookingTime: new Date(now.getTime() - 2 * 60 * 60 * 1000 - 10 * 60 * 1000).toISOString(), // 2h 10min ago
      entryTime: new Date(now.getTime() - 2 * 60 * 60 * 1000 - 5 * 60 * 1000).toISOString(), // 2h 5min ago (5 min after booking)
      exitTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      duration: '4 hours',
      amount: 120
    },
    
    // Completed booking from yesterday - booked 15 min before entry
    {
      slotId: 12,
      slotNumber: 'P012',
      vehicleNumber: 'KA02AB5678',
      userName: 'customer1',
      bookingTime: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000 - 15 * 60 * 1000).toISOString(), // 15 min before entry
      entryTime: new Date(yesterday.getTime() + 9 * 60 * 60 * 1000).toISOString(),
      exitTime: new Date(yesterday.getTime() + 18 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      duration: '9 hours',
      amount: 270
    },
    
    // Cancelled booking - booked 7 min before scheduled entry but cancelled
    {
      slotId: 8,
      slotNumber: 'P008',
      vehicleNumber: 'KA03CD9012',
      userName: 'customer1',
      bookingTime: new Date(yesterday.getTime() + 14 * 60 * 60 * 1000 - 7 * 60 * 1000).toISOString(), // 7 min before
      entryTime: null, // No entry since cancelled
      exitTime: null,
      status: 'cancelled',
      duration: '2 hours',
      amount: 0 // No charge for cancelled booking
    },
    
    // Another active booking - booked 18 min ago, entered 3 min later
    {
      slotId: 15,
      slotNumber: 'P015',
      vehicleNumber: 'KA04EF3456',
      userName: 'customer2',
      bookingTime: new Date(now.getTime() - 1 * 60 * 60 * 1000 - 18 * 60 * 1000).toISOString(), // 1h 18min ago
      entryTime: new Date(now.getTime() - 1 * 60 * 60 * 1000 - 15 * 60 * 1000).toISOString(), // 1h 15min ago (3 min after booking)
      exitTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      duration: '4 hours',
      amount: 120
    },
    
    // Completed booking - booked 12 min before entry
    {
      slotId: 20,
      slotNumber: 'P020',
      vehicleNumber: 'KA05GH7890',
      userName: 'customer3',
      bookingTime: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000 - 12 * 60 * 1000).toISOString(), // 12 min before entry
      entryTime: new Date(yesterday.getTime() + 10 * 60 * 60 * 1000).toISOString(),
      exitTime: new Date(yesterday.getTime() + 15 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      duration: '5 hours',
      amount: 150
    },
    
    // Just booked slot - booked now, not entered yet
    {
      slotId: 22,
      slotNumber: 'P022',
      vehicleNumber: 'KA06IJ4321',
      userName: 'customer2',
      bookingTime: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      entryTime: null,
      exitTime: null,
      status: 'booked',
      duration: null,
      amount: 0
    },
    
    // Recently booked slot - booked 8 minutes ago, customer should arrive soon
    {
      slotId: 3,
      slotNumber: 'P003',
      vehicleNumber: 'KA07KL8765',
      userName: 'customer3',
      bookingTime: new Date(now.getTime() - 8 * 60 * 1000).toISOString(), // 8 minutes ago
      entryTime: null,
      exitTime: null,
      status: 'booked',
      duration: null,
      amount: 0
    }
  ];

  await db.bookings.bulkAdd(dummyBookings);

  // Update slot statuses based on bookings
  // Slot 5 - occupied (customer entered)
  await db.slots.update(5, {
    occupied: true,
    booked: true,
    vehicleNumber: 'KA01MN1234',
    userName: 'customer1',
    entryTime: dummyBookings[0].entryTime
  });

  // Slot 15 - occupied (customer entered)
  await db.slots.update(15, {
    occupied: true,
    booked: true,
    vehicleNumber: 'KA04EF3456',
    userName: 'customer2',
    entryTime: dummyBookings[3].entryTime
  });

  // Slot 22 - just booked (customer hasn't entered yet)
  await db.slots.update(22, {
    occupied: false,
    booked: true,
    vehicleNumber: 'KA06IJ4321',
    userName: 'customer2',
    entryTime: null
  });

  // Slot 3 - booked 8 minutes ago (customer should arrive within 12 more minutes)
  await db.slots.update(3, {
    occupied: false,
    booked: true,
    vehicleNumber: 'KA07KL8765',
    userName: 'customer3',
    entryTime: null
  });

};

// Function to initialize all dummy data
export const initializeDummyData = async () => {
  try {
    
    await createDummyUsers();
    await createDummySlots();
    await createDummyBookings();
    
    
    // Return summary
    const summary = {
      users: await db.users.count(),
      slots: await db.slots.count(),
      bookings: await db.bookings.count(),
      slotsBooked: await db.slots.where('booked').equals(true).count(),
      slotsOccupied: await db.slots.where('occupied').equals(true).count(),
      slotsAvailable: await db.slots.where('booked').equals(false).and(slot => !slot.occupied).count()
    };
    
    return summary;
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
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};