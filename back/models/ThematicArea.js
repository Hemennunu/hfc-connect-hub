const mongoose = require('mongoose');

const thematicSchema = new mongoose.Schema({
  category: String,
  description: String,
});

module.exports = mongoose.model('ThematicArea', thematicSchema);
