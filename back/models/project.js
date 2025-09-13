const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: String,
  completedDate: String,
  beneficiaries: { type: String, required: true },
  budget: { type: String, required: true },
  impact: String, // For completed projects
  status: { 
    type: String, 
    enum: ['ongoing', 'completed'], 
    default: 'ongoing' 
  },
  category: { 
    type: String, 
    enum: [
      'Child Development',
      'Economic Development', 
      'Education',
      'Community Empowerment',
      'Governance',
      'Healthcare',
      'Community Development'
    ],
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
