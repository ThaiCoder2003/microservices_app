const mongoose = require('mongoose');

const CartEventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  payload: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartEvent', CartEventSchema);