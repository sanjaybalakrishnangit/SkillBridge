/**
 * Seed script — creates an admin user and sample workers.
 * Run: npm run seed
 */
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Worker = require('./models/Worker');

const sampleWorkers = [
  { name: 'Ravi Kumar', skill: 'Plumber', location: 'Andheri, Mumbai', phone: '9876543210', isAvailable: true, isVerified: true, rating: 4.5, experience: '8 years of residential and commercial plumbing' },
  { name: 'Suresh Yadav', skill: 'Electrician', location: 'Dharavi, Mumbai', phone: '9123456789', isAvailable: true, isVerified: true, rating: 4.8, experience: '10 years of electrical wiring and installations' },
  { name: 'Mohan Lal', skill: 'Painter', location: 'Bandra, Mumbai', phone: '9988776655', isAvailable: false, isVerified: false, rating: 3.9, experience: '5 years of interior and exterior painting' },
  { name: 'Arjun Singh', skill: 'Carpenter', location: 'Goregaon, Mumbai', phone: '9876501234', isAvailable: true, isVerified: true, rating: 4.2, experience: '12 years of furniture and woodwork' },
  { name: 'Deepak Patel', skill: 'Driver', location: 'Thane', phone: '9765432100', isAvailable: true, isVerified: false, rating: 4.0, experience: 'Commercial vehicle driver with clean record' },
  { name: 'Mukesh Sharma', skill: 'Mason', location: 'Kurla, Mumbai', phone: '9654321098', isAvailable: true, isVerified: true, rating: 4.6, experience: '15 years of construction and masonry work' },
  { name: 'Pradeep Nair', skill: 'Gardener', location: 'Powai, Mumbai', phone: '9543210987', isAvailable: true, isVerified: true, rating: 4.1, experience: 'Landscape and garden maintenance' },
  { name: 'Vijay Tiwari', skill: 'Welder', location: 'Malad, Mumbai', phone: '9432109876', isAvailable: false, isVerified: true, rating: 4.7, experience: 'Heavy metal and precision welding' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ phone: '9999999999' });
    if (!adminExists) {
      await User.create({ name: 'Admin', phone: '9999999999', password: 'admin123', role: 'admin' });
      console.log('✅ Admin user created  →  phone: 9999999999  |  password: admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed sample workers
    const workerCount = await Worker.countDocuments();
    if (workerCount === 0) {
      await Worker.insertMany(sampleWorkers);
      console.log(`✅ ${sampleWorkers.length} sample workers seeded`);
    } else {
      console.log('ℹ️  Workers already exist — skipping worker seed');
    }

    console.log('\n🎉 Seeding complete!');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
