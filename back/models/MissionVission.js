const mongoose = require('mongoose');

const missionVisionSchema = new mongoose.Schema({
  mission: String,
  vision: String,
});

module.exports = mongoose.model('MissionVision', missionVisionSchema);
