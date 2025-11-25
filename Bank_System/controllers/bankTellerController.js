const Admin = require('../models/bankTellerModel');
const User = require('../models/userModel');

const bankTellerController = {
  // Get All Users
    getAllUser: async (req, res) => {
    try {
      const userDetails = await Admin.getAllUser();
      res.json({
        success: true,
        data: userDetails
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Users',
        error: error.message
      });
      }
    },

  // Get User by ID
    getUserByID: async (req, res) => {
    try {
      const user = await Admin.getUserByID(req.params.userID);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User ID not found'
        });
      }
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching User by ID',
        error: error.message
      });
    }
},
  // Get User by Status
  getUserByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      const User = await Admin.getUserByStatus(status);
      
      // Validation for status
      if((status !== 'Active' && status !== 'active') && (  status !== 'Inactive' && status !== 'inactive')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Please use Active or Inactive.'
        });
      }
      // Check if any users found
      if(User.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No Users found with the specified status'
        });
      }
      res.json({
        success: true,
        data: User
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching User by status',
        error: error.message
      });
    }
  },
  // Create New User Account
  createUser: async (req, res) => {
    try {
      const { UserID, FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress } = req.body;

      // Input Validation
      if (!UserID || !FullName || !Age || !Address || !DateofBirth || !Gender || !ContactNumber || !EmailAddress) {
        return res.status(400).json({
          success: false,
          message: ['All fields are required', ('UserID, FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress')]
        });
      }
      // User ID validation
      const userExists = await Admin.getUserByID(UserID);
      if (userExists) {
        return res.status(409).json({
          success: false,
          message: 'UserID already exists. Please use a different UserID.'
        });
      }
      const newUser = await Admin.createUser({
        UserID, FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Error creating User',
          error: error.message
        });
      }
  },
  // Delete User Account
  deleteUser: async (req, res) => {
    try {
      const { userID } = req.params;

      // Check if user exists
      const user = await Admin.getUserByID(userID);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User ID not found'
        });
      }

      await Admin.deleteUser(userID);
      res.json({
        success: true,
        message: 'User deleted successfully',
        UserID: user.UserID,
        FullName: user.FullName
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting User',
        error: error.message
      });
    }
  },

  // Approve Deposit 
  approveDeposit: async (req, res) => {
    try {
      const { transactionID } = req.params;
      const transactionStatus = await Admin.getTransactionByTransactionID(transactionID);

      if(transactionStatus.Type !== 'Deposit') {
        return  res.status(400).json({
          success: false,
          message: 'Transaction is not a Deposit type'
        });
      }
      if(transactionStatus.Status === 'Approved') {
        return  res.status(400).json({
          success: false,
          message: 'Transaction already approved'
        });
      }
      

      const transactionData = await Admin.approveDeposit(transactionID);
    
      
      res.json({
        success: true,
        message: 'Deposit approved successfully',
        data: transactionData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving Deposit',
        error: error.message
      });
    }
  },
  // Approve Withdrawal
  approveWithdrawal: async (req, res) => {
    try {
      const { transactionID } = req.params;
      const transactionStatus = await Admin.getTransactionByTransactionID(transactionID);

      if(transactionStatus.Type !== 'Withdrawal') {
        return  res.status(400).json({
          success: false,
          message: 'Transaction is not a Withdrawal type'
        });
      }
      if(transactionStatus.Status === 'Approved') {
        return  res.status(400).json({
          success: false,
          message: 'Transaction already approved'
        });
      }
      

      const transactionData = await Admin.approveWithdrawal(transactionID);

      res.json({
        success: true,
        message: 'Withdrawal approved successfully',
        data: transactionData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving Withdrawal',
        error: error.message
      });
    }
  },

  // Approve Loan 
  approveLoan: async (req, res) => {
    try {
      const userID = req.params.userID;
      const {InterestRate, totalAmount, MonthlyPayment} = req.body;

      // Check if user exists
      const existingUser = await Admin.getUserByID(userID);
      if (!existingUser) {  
        return res.status(404).json({
          success: false,
          message: 'User ID not found'
        });
      }
      // Input Validation
      if (!InterestRate || !totalAmount || !MonthlyPayment) {
        return res.status(400).json({
          success: false,
          message: ['All fields are required', '(InterestRate, totalAmount, MonthlyPayment)']
        });
      }
      // Loan Status Validation
      const loanStatus = await Admin.getLoanByID(userID);
      if(loanStatus.Status === 'Active') {
        return  res.status(400).json({
          success: false,
          message: 'Loan already active'
        });
      }
      const loanData = await Admin.approveLoan(userID, {InterestRate, totalAmount, MonthlyPayment});

      res.json({
        success: true,
        message: 'Loan approved successfully',
        UserID: userID,
        data: loanData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error approving Loan',
        error: error.message
      });
    }
  },
  // Get All Transactions 
    getAllTransactions: async (req, res) => {
    try {
      const transactions = await Admin.getAllTransactions();
      res.json({
        success: true,
        data: transactions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching transactions',
        error: error.message
      });
      }
    },
  // Get Transactions by ID
    getTransactionByID: async (req, res) => {
    try {
      const userTransaction = await Admin.getTransactionByID(req.params.userID);
      if (!userTransaction) {
        return res.status(404).json({
          success: false,
          message: 'User ID not found'
        });
      }
      res.json({
        success: true,
        data: userTransaction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Transactions by User ID',
        error: error.message
      });
    }
},
// Get Transactions by Type
  getTransactionByType: async (req, res) => {
    try {
      const { Type } = req.params;
      const transactionData = await Admin.getTransactionByType(Type);
      
      // Validation for Type
      if((Type !== 'Withdrawal' && Type !== 'withdrawal') && (  Type !== 'Deposit' && Type !== 'deposit')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Type. Please use withdrawal or deposit.'
        });
      }
      // Check if any users found
      if(transactionData.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No Users found with the specified Type'
        });
      }
      res.json({
        success: true,
        data: transactionData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Transactions by Type',
        error: error.message
      });
    }
  },
// Get Transactions by Status
  getTransactionByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      const statusData = await Admin.getTransactionByStatus(status);
      
      // Validation for Type
      if((status !== 'Pending' && status !== 'pending') && (  status !== 'Approved' && status !== 'approved')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Status. Please use pending or approved'
        });
      }
      // Check if any users found
      if(statusData.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No Users found with the specified Status'
        });
      }
      res.json({
        success: true,
        data: statusData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Transactions by Status',
        error: error.message
      });
    }
  },

  // Get All Loans
  getAllLoans: async (req, res) => {
    try {
      const loans = await Admin.getAllLoans();
      res.json({
        success: true,
        data: loans
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching transactions',
        error: error.message
      });
      }
  },
  // Get Loan by ID
  getLoanByID: async (req, res) => {
    try {
      const userLoan = await Admin.getLoanByID(req.params.userID);
      if (!userLoan) {
        return res.status(404).json({
          success: false,
          message: 'User ID not found'
        });
      }
      res.json({
        success: true,
        data: userLoan
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Loan by User ID',
        error: error.message
      });
    }
  },
  // Get Loan by Status
  getLoanByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      const statusData = await Admin.getLoanByStatus(status);
      
      // Validation for Type
      if((status !== 'Pending' && status !== 'pending') && (  status !== 'Active' && status !== 'active') && (status !== 'Finished' && status !== 'finished')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Status. Please use pending, active, or finished.'
        });
      }
      // Check if any users found
      if(statusData.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No Users found with the specified Status'
        });
      }
      res.json({
        success: true,
        data: statusData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching Loans by Status',
        error: error.message
      });
    }
  },
}

module.exports = bankTellerController;