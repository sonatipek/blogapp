// Requirements
const express = require('express');
// Controllers
const authController = require('../controllers/auth');
// Create Router
const router = express.Router();


// Auth Routes
// Register Routes
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Login Routes
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)

// Logout Routes
router.get('/logout', authController.getLogout)

// Reset Password Routes
router.get('/reset-password', authController.getReset);
router.post('/reset-password', authController.postReset);

// Reset Password with Token
router.get('/reset-password/:token', authController.getResetPasswordWithToken);
router.post('/reset-password/:token', authController.postResetPasswordWithToken);



module.exports=router;