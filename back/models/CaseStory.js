const mongoose = require('mongoose');

const caseStorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  beneficiaryName: { type: String },
  location: { type: String },
  category: { 
    type: String, 
    enum: ['Child Development', 'Community Empowerment', 'HIV/AIDS Support', 'Social Accountability'],
    required: true 
  },
  mediaType: { 
    type: String, 
    enum: ['text', 'photo', 'video', 'audio', 'photo_essay'],
    default: 'text'
  },
  mediaUrl: { type: String },
  thumbnailUrl: { type: String },
  featured: { type: Boolean, default: false },
  publishDate: { type: Date, default: Date.now },
  tags: [{ type: String }],
  impact: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CaseStory', caseStorySchema);
