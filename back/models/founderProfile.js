const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema({
  name: {type: String, required: true},
  bio: String,
  photoUrl: String,
});

module.exports = mongoose.model('FounderProfile', founderSchema);
