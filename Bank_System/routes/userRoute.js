const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/User/:userID - Get Account Details
router.get('/AccountDetails/:userID', userController.getAccountDetails);

// GET /api/balance/:userID - View Balance 
router.get('/balance/:userID', userController.viewBalance);

// PUT /api/User/:userID - Update Account Info
router.put('/Update/:userID', userController.updateAccountInfo);

// POST /api/Applyloan/:userID - Apply for a Loan
router.post('/ApplyLoan/:userID', userController.applyLoan);

// POST /api/deposit/:userID - Deposit
router.post('/deposit/:userID', userController.deposit);

//POST /api/withdraw/:userID - Withdraw
router.post('/withdraw/:userID', userController.withdraw);

//GET /api/Transactions/:userID - ViewTransactions
router.get('/Transactions/:userID', userController.viewTransactions);

//GET /api/PendingLoan/:userID - ViewPendingLoan
router.get('/PendingLoan/:userID', userController.viewPendingLoan);

//GET /api/ActiveLoan/:userID - ViewPendingLoan
router.get('/ActiveLoan/:userID', userController.viewActiveLoan);

module.exports = router;