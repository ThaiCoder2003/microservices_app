const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  service: { type: String, default: 'transaction-service' },
  action: { type: String, required: true, trim: true },  
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending', 
    index: true 
  },
  payload: { type: mongoose.Schema.Types.Mixed, default: {} }, // More flexible than Object
  error: { type: String, default: null },
}, { 
  timestamps: true // Auto-handles createdAt and updatedAt
});

// Optional: faster queries by eventId + status
StatusSchema.index({ eventId: 1, status: 1 });

module.exports = mongoose.model('Status', StatusSchema);