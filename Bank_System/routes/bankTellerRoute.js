const express = require('express');
const router = express.Router();
const bankTellerController = require('../controllers/bankTellerController');

// GET /api/Admin/User - Get All Users
router.get('/User', bankTellerController.getAllUser);

// GET /api/Admin/User/:userID - Get User by ID
router.get('/User/:userID', bankTellerController.getUserByID);

// GET /api/Admin/User/status/:status - Get User by Status
router.get('/User/status/:status', bankTellerController.getUserByStatus);

// POST /api/Admin/createUser - Create New User Account
router.post('/createUser', bankTellerController.createUser);

// DELETE /api/Admin/User/:userID - Delete User Account
router.delete('/User/:userID', bankTellerController.deleteUser);

// PUT /api/Admin/approveDeposit/:transactionID - Approve Deposit
router.put('/approveDeposit/:transactionID', bankTellerController.approveDeposit);

// PUT /api/Admin/approveWithdrawal/:transactionID - Approve Withdrawal
router.put('/approveWithdrawal/:transactionID', bankTellerController.approveWithdrawal);

// PUT /api/Admin/approveLoan/:loanID - Approve Loan
router.put('/approveLoan/:userID', bankTellerController.approveLoan);

// GET /api/Admin/Transactions - Get All Transactions
router.get('/Transactions', bankTellerController.getAllTransactions);

// GET /api/Admin/Transactions/:userID - Get Transactions by UserID
router.get('/Transactions/:userID', bankTellerController.getTransactionByID);

// GET /api/Admin/Transactions/type/:type - Get Transactions by Type
router.get('/Transactions/type/:Type', bankTellerController.getTransactionByType);

// GET /api/Admin/Transactions/status/:status - Get Transactions by Status
router.get('/Transactions/status/:status', bankTellerController.getTransactionByStatus);

// GET /api/Admin/Loans - Get All Loans
router.get('/Loans', bankTellerController.getAllLoans);

// GET /api/Admin/Loans/:loanID - Get Loan by ID
router.get('/Loans/:userID', bankTellerController.getLoanByID);

// GET /api/Admin/Loans/status/:status - Get Loans by Status
router.get('/Loans/status/:status', bankTellerController.getLoanByStatus);

module.exports = router;