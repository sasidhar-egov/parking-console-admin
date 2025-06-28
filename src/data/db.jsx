import Dexie from 'dexie';

export const db = new Dexie('RestaurantParkingDB');

db.version(1).stores({
  slots: '++id, number, occupied, &vehicleNumber, &userName, entryTime',
  bookings: '++id, slotId, vehicleNumber, userName, entryTime, exitTime, status',
  users: '++id, &username, &phone, name, role, password'
});


export const seedDatabase = async () => {
  const slots = Array.from({ length: 20 }, (_, i) => ({
    number: `A${i + 1}`,
    occupied: false,
    vehicleNumber: null,
    userName: null,
    entryTime: null
  }));

  const users = [
    { name: 'Admin', phone: '9999999999', role: 'admin' },
    { name: 'Staff', phone: '8888888888', role: 'staff' },
    { name: 'Customer', phone: '7777777777', role: 'customer' }
  ];

  await db.slots.bulkAdd(slots);
  await db.users.bulkAdd(users);
};