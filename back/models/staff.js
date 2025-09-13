const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  department: String,
  location: String,
  email: { type: String, trim: true, lowercase: true },
  phone: String,
  status: { type: String, enum: ['current', 'former'], default: 'current' },
  yearOfService: String, // for former staff
}, {
  timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
