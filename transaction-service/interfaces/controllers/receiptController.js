const jwt = require('jsonwebtoken');
const userServices = require('../../infrastructure/services/userServices')
require('dotenv').config();
const createReceipt = require('../../usecases/receipt/createReceipt')
const getReceipts = require('../../usecases/receipt/getReceipts')    
const userServices = require('../../infrastructure/services/userServices')

module.exports = {
    get: async (req, res) => {
        try {
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authToken.replace('Bearer ', '');
            const decodedUserID = jwt.verify(token, process.env.JWT_SECRET).id;

            const user = await userServices.getUserById(decodedUserID);
            if (!user) {
                return res.status(401).json({ error: 'Invalid user' });
            }

            const receipts = await getReceipts(decodedUserID);
            res.status(200).json(receipts);
        } catch (error) {
            console.error('Error getting receipt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    purchase: async (req, res) => {
        try {
            const authToken = req.headers.authorization;
            if (!authToken) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = authToken.replace('Bearer ', '');
            const decodedUserID = jwt.verify(token, process.env.JWT_SECRET).id;

            const user = await userServices.getUserById(decodedUserID);
            if (!user) {
                return res.status(401).json({ error: 'Invalid user' });
            }

            const purchaseResult = await createReceipt(decodedUserID);

            res.status(201).json({ message: 'Purchase Complete!', purchaseResult })
        } catch (error) {
            console.error('Error getting receipt:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}