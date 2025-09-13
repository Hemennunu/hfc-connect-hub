// backend/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['announcement', 'event', 'successStory', 'pressRelease', 'industryNews', 'blog', 'multimedia'],
    required: true 
  },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  eventDate: Date, // for events
  location: String, // for events if needed
  mediaUrl: String, // for photos, videos, audio etc.
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional for admin user tracking
});

module.exports = mongoose.model('News', newsSchema);
