// user-service/models/status.model.js

const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  service: { type: String, default: 'user-service' },
  action: { type: String, required: true },  // e.g. 'register'
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending', index: true },
  payload: { type: Object, default: {} },
  error: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

StatusSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Status', StatusSchema);