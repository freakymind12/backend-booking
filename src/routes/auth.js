// routes/auth.js
const express = require('express');
const authController = require('../controllers/auth.js')
const authMiddleware = require('../middleware/auth.js')
const { query } = require('express-validator');

const router = express.Router();

const validateRecovery = [
  query('iv').notEmpty().withMessage('token iv is required'),
  query('data').notEmpty().withMessage('data is required')
]

router.post('/login', authController.loginUser);

router.post('/forgot-password', validateRecovery, authController.forgotPassword);

router.post('/recovery-password', authController.recoverPassword)

router.post('/logout', authController.logoutUser);

router.post('/refresh', authMiddleware.validateRefreshToken, authController.refreshToken)

module.exports = router;
