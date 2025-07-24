const CartEvent = require('../../infrastructure/models/CartEventModel');

module.exports = {
    createEvent: (eventData) => new CartEvent(eventData).save(),
    getEventsByUser: (userId) => 
        CartEvent.find({ userId }).sort({ timestamp: 1 }).exec(),
};