const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/profile', userController.profile); // Route to get user profile
router.get('/users', userController.list); // Route to get all users
router.post('/register', userController.register); // Route to register a new user
router.post('/login', userController.login); // Route to login a user
router.put('/update', userController.update); // Route to update user profile
// Route to register a new use