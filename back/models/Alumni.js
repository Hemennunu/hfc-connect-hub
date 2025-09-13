const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  profileImage: { type: String },
  currentOccupation: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  yearsInProgram: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  successStory: { type: String, required: true },
  achievements: [{ type: String }],
  linkedinProfile: { type: String },
  websiteUrl: { type: String },
  consented: { type: Boolean, default: false, required: true },
  isPublic: { type: Boolean, default: false },
  testimonial: { type: String },
  impactStatement: { type: String },
  mentorshipAvailable: { type: Boolean, default: false },
  createdByAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for search functionality
alumniSchema.index({ name: 'text', currentOccupation: 'text', company: 'text' });

module.exports = mongoose.model('Alumni', alumniSchema);
