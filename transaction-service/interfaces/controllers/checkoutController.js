const jwt = require('jsonwebtoken');
const userServices = require('../../infrastructure/services/userServices');
const Status = require('../../infrastructure/models/status.model');
require('dotenv').config();
const checkout = require('../../usecases/receipt/checkout')
const getReceipts = require('../../usecases/receipt/getReceipts')    

const secret = process.env.JWT_SECRET;

module.exports = {
    get: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, secret);
            const id = decoded.id

            const user = await userServices.getUserById(id);
            if (!user) {
                return res.status(401).json({ error: 'Invalid user' });
            }

            const receipts = await getReceipts(user.id);
            res.json(receipts);
        } catch (error) {
            console.error('Error getting receipt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    purchase: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const id = decoded.id

            const user = await userServices.getUserById(id);
            if (!user) {
                return res.status(401).json({ error: 'Invalid user' });
            }

            const purchaseResult = await checkout(user.id);

            res.status(purchaseResult.status).json({ message: purchaseResult.message, eventId: purchaseResult.eventId, service: 'transaction-service' })
        } catch (error) {
            console.error('Error getting receipt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getStatus: async (req, res) => {
        try {
            const { eventId } = req.params;
            if (!eventId)
                return res.status(404).json({ error: "There's no event Id to check!" })
            const getStatus = await Status.findOne({ eventId });
            return res.json(getStatus)
        } catch (err) {
            return res.status(500).json({ error: 'Cannot retrieve status' });
        }
    }
}