const receiptRepository = require('../../domain/repositories/receiptRepository');
const receiptEvents = require('../../domain/events/receiptEvents')
const Receipt = require('../../domain/entities/Receipt');

module.exports = async function GetReceipts(userId) {
    try {
        const events = await receiptRepository.getEventsByUser(userId);
        
        if (!events || events.length === 0) {
            return {
                userId: userId,
                receipts: [],
            };
        }

        const receipt = new Receipt(userId);
        receipt.applyEvents(events);

        const { receipts } = receipt.getAll();
        return {
            userId,
            receipts
        }
    }
    catch (err){
        console.error(err);
        throw new Error('Failed to get receipt');
    }
}