// david la gabana
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/User/:userID - Get Account Details
router.get('/AccountDetails/:userID', userController.getAccountDetails);

// GET /api/balance/:userID - View Balance 
router.get('/balance/:userID', userController.viewBalance);

// PUT /api/User/:userID - Update Account Info
router.put('/:userID', userController.updateAccountInfo);

// POST /api/loan/ - Apply for a Loan
router.post('/loan', userController.applyLoan);

// POST /api/deposit/ - Deposit
router.post('/deposit', userController.deposit);

//POST /api/withdraw/ - Withdraw
router.post('/withdraw', userController.withdraw);

module.exports = router;
