const registerUser = require('../usecases/registerUser');
const loginUser = require('../usecases/loginUser');
const getAllUsers = require('../usecases/getAllUsers');
const getProfile = require('../usecases/getProfile');
const updateUser = require('../usecases/updateUser');
const deleteUser = require('../usecases/deleteUser');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = {
    register: async (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
        try {
            const user = await registerUser({ name, email, password, confirmPassword });
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        try {
            const user = await loginUser(req.body);
            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                secret
            );        
            res.status(200).json({ token });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    },

    list: async (req, res) => {
        try {
            const users = await getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    },

    profile: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) 
                return res.status(401).json({ error: 'Missing token' });

            const token = authHeader.replace('Bearer ', '');
            jwt.verify(token, secret, async (err, decoded) => {
                if (err) return res.status(401).json({ error: 'Invalid token' });
                const userId = decoded.id;
                const user = await getProfile(userId);
                if (!user) return res.status(404).json({ error: 'User not found' });
                res.json({ 
                    id: user.id, 
                    email: user.email, 
                    name: user.name, 
                    profilePicture: user.profilePicture, 
                    birthday: user.birthday,
                    address: user.address,
                    phone: user.phone
                 });
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    },

    update: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) 
                return res.status(401).json({ error: 'Missing token' });

            const token = authHeader.replace('Bearer ', '');
            jwt.verify(token, secret, async (err, decoded) => {
                if (err) return res.status(401).json({ error: 'Invalid token' });
                const userId = decoded.id;
                const email = decoded.email;
                if (!userId || !email) {
                    return res.status(400).json({ error: 'User ID and Email are required' });
                }

                const { name, profilePicture, address, phone, birthday } = req.body;

                await updateUser({ userId, email, name, profilePicture, address, phone });
                res.status(200).json({ message: 'User updated successfully' });
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    },

    delete: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) 
                return res.status(401).json({ error: 'Missing token' });

            const token = authHeader.replace('Bearer ', '');
            jwt.verify(token, secret, async (err, decoded) => {
                if (err) return res.status(401).json({ error: 'Invalid token' });
                const role = decoded.role;
                if (role !== 'Admin') {
                    return res.status(403).json({ error: 'Admin only!' });
                }
                const { id } = req.params;
                
                const result = await deleteUser(id);
                res.status(200).json({ message: result.message })
            });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }
}