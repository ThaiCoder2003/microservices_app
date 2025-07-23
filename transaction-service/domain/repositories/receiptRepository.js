const ReceiptEvent = require('../models/ReceiptEventModule');

module.exports = {
    createEvent: (eventData) => new ReceiptEvent(eventData).save(),
    getEventsByUser: (userId) =>
        ReceiptEvent.find({ userId }).sort({ timestamp: 1 }).exec(),
};