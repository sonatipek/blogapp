// Requirements
const express = require('express');
// Controllers
const authController = require('../controllers/auth');
// Create Router
const router = express.Router();


// Auth Routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);



module.exports=router;