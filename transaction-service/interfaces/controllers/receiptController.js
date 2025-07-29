const jwt = require('jsonwebtoken');
const userServices = require('../../infrastructure/services/userServices')
require('dotenv').config();
const createReceipt = require('../../usecases/receipt/createReceipt')
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
            res.status(200).json(receipts);
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

            const purchaseResult = await createReceipt(user.id);

            res.status(201).json({ message: 'Purchase Complete!', purchaseResult })
        } catch (error) {
            console.error('Error getting receipt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}