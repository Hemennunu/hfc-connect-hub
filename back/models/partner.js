const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: String,
  logoUrl: String,
  website: String,
});

module.exports = mongoose.model('Partner', partnerSchema);
