const mongoose = require('mongoose');

const boardMemberSchema = new mongoose.Schema({
  name: {type: String, required: true},
  role: String,
  education: String,
});

module.exports = mongoose.model('BoardMember', boardMemberSchema);
