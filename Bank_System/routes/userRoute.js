// david la gabana
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/User/:userID - Get Account Details
router.get('/api/User/:userID', userController.getAccountDetails);

// GET /api/balance/:userID - View Balance 
router.get('/api/balance/:userID', userController.getviewBalance);

// PUT /api/User/:userID - Update Account Info
router.put('/api/User/:userID', userController.updateAccountInfo);

// POST /api/loan/ - Apply for a Loan
router.post('/api/loan/', userController.applyLoan);

// POST /api/deposit/ - Deposit
router.post('/api/deposit/', userController.deposit);

//POST /api/withdraw/ - Withdraw
router.post('/api/withdraw/', userController.withdraw);

module.exports = router;
