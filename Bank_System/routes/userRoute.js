const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/User/:userID - Get Account Details
router.get('/AccountDetails/:userID', userController.getAccountDetails);

// GET /api/User/balance/:userID - View Balance 
router.get('/balance/:userID', userController.viewBalance);

// PUT /api/User/:userID - Update Account Info
router.put('/Update/:userID', userController.updateAccountInfo);

// POST /api/User/Applyloan/:userID - Apply for a Loan
router.post('/ApplyLoan/:userID', userController.applyLoan);

// POST /api/User/deposit/:userID - Deposit
router.post('/deposit/:userID', userController.deposit);

//POST /api/User/withdraw/:userID - Withdraw
router.post('/withdraw/:userID', userController.withdraw);

//GET /api/User/Transactions/:userID - ViewTransactions
router.get('/Transactions/:userID', userController.viewTransactions);

//GET /api/User/PendingLoan/:userID - ViewPendingLoan
router.get('/PendingLoan/:userID', userController.viewPendingLoan);

//GET /api/User/ActiveLoan/:userID - ViewPendingLoan
router.get('/ActiveLoan/:userID', userController.viewActiveLoan);

// POST /api/User/PayLoan/:userID - Pay Loan
router.put('/PayLoan/:userID', userController.payLoan);

module.exports = router;