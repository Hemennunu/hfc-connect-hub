const mongoose = require('mongoose');
require('dotenv').config();
const Stats = require('./models/Stats');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedStats = async () => {
  try {
    await connectDB();
    
    // Clear existing stats
    await Stats.deleteMany({});
    
    // Create initial stats based on current Home component data
    const initialStats = [
      {
        number: "145,871+",
        label: "OVC, PLWHA & Other Direct Beneficiaries Reached",
        order: 1,
        isActive: true
      },
      {
        number: "25+",
        label: "Years of Service",
        order: 2,
        isActive: true
      },
      {
        number: "1,635+",
        label: "Volunteer Providers",
        order: 3,
        isActive: true
      },
      {
        number: "119+",
        label: "CSOs & CBOs Strengthened",
        order: 4,
        isActive: true
      }
    ];
    
    await Stats.insertMany(initialStats);
    console.log('Stats seeded successfully');
    
    // Display created stats
    const createdStats = await Stats.find().sort({ order: 1 });
    console.log('Created stats:', createdStats);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding stats:', error);
    process.exit(1);
  }
};

seedStats();
