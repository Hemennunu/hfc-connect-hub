const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  // Main statistic number (e.g., "2,100+")
  number: {
    type: String,
    required: true,
    trim: true
  },
  // Statistic label (e.g., "Children Sponsored")
  label: {
    type: String,
    required: true,
    trim: true
  },
  // Icon name (e.g., "users", "globe", "heart", etc.)
  icon: {
    type: String,
    required: true,
    trim: true,
    default: 'circle'
  },
  // Background color class (e.g., "blue", "green", "orange", "purple")
  color: {
    type: String,
    required: true,
    trim: true,
    default: 'blue',
    enum: ['blue', 'green', 'orange', 'purple']
  },
  // Display order
  order: {
    type: Number,
    required: true,
    default: 0
  },
  // Whether the stat is active
  isActive: {
    type: Boolean,
    default: true
  },
  // When the stat was created
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
statsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure unique order values for active stats
statsSchema.index({ order: 1, isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } });

module.exports = mongoose.model('Stats', statsSchema);
