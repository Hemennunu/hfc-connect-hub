const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Child Development', 'Community Empowerment', 'HIV/AIDS Support', 'Social Accountability', 'Events', 'Training'],
    required: true 
  },
  description: { type: String, required: true },
  location: String,
  date: { type: Date, default: Date.now },
  mediaUrl: String, // for photos, videos
  mediaType: { 
    type: String, 
    enum: ['photo', 'video'], 
    default: 'photo' 
  },
  featured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('GalleryItem', gallerySchema);
