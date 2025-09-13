const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  type: {type: String, enum: ['local', 'international']},
  method: String,
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  amount: Number,
  date: {type: Date, default: Date.now},
  status: String,
});

module.exports = mongoose.model('Donation', donationSchema);
