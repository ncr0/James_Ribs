const User = require('../models/userModel');
const database = require('../database');  // for some direct queries - helps automation

const userController = {
//Get Account Details
getAccountDetails: async (req, res) => {
    try {
        // const { UserID } = req.params;
      const details = await User.getAccount(req.params.userID);
      if (!details) {
        return res.status(404).json({
          success: false,
          message: 'User ID not found'
        });
      }
      res.json({
        success: true,
        data: details
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching data',
        error: error.message
      });
    }
},
// viewBalance
viewBalance: async (req, res) => {
  try {
    //const userId = req.params.id; 
    const balance = await User.viewBalanceById(req.params.userID);

    if (!balance) {
      return res.status(404).json({
          success: false,
          message: 'User ID not found'
        });
    }
    res.json({
        success: true,
        data: balance
      });
  } catch (error) {
    res.status(500).json({
        success: false,
        message: 'Error fetching data',
        error: error.message
    });
  }
},

  // update Accountinfo
  updateAccountInfo: async (req, res ) => {
    try {
        const {FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress} = req.body;
        const userID = req.params.userID;
        

        // user checker
        const existingUser = await User.getAccount(userID);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // validation
        if (!FullName|| !Age || !Address || !DateofBirth || !Gender || !ContactNumber || !EmailAddress) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (fullName, age, address, dateOfBirth, gender, contactNumber, emailAddress)'
            });
        }
        await User.updateAccountInfo(userID, {
            FullName,
            Age,
            Address,
            DateofBirth,    
            Gender,
            ContactNumber,
            EmailAddress
        });
        res.status(200).json({
            success: true,
            message: 'User account information updated successfully'
        });
    } catch (error) {
        console.error('Error updating user account information:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user account information',
            error: error.message
        });
      }
    },
    //applyLoan
    applyLoan: async (req, res) => {
        try {
            const {UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome, Status} = req.body;
            const userID = req.params.userID;
            // user checker
            const existingUser = await User.getAccount(userID);
            if (!existingUser) {
                return res.status(404).json({
                success: false,
                message: 'User not found'
                });
            }
            // check pending /active loans
            const pendingLoans = await User.viewPendingLoanById(userID)

            if (pendingLoans.length === 0) {
                const activeLoans = await User.viewActiveLoans(userID);
                if (activeLoans.length > 0) {
                    return res.status(400).json({
                    success: false,
                    message: 'You already have an active or pending loan'
                    });
                }
            }
            // validation
            if (!UserID || !LoanAmount || !MonthsToPay || !Reason || !MonthlyIncome) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields  are required (UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome)'
                });
            }
            // months to pay limit 3 years (36 months)
            if(MonthsToPay > 36) {
                return res.status(400).json({
                    success: false,
                    message: 'Months to pay cannot exceed 36 months'
                });
            }
            const newLoanApplication = await User.applyLoan({
                UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome, Status
            });
            res.status(201).json({
                success: true,
                message: 'Loan application submitted successfully',
                status: 'Pending',
                loanApplication: newLoanApplication
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error submitting loan application',
                error: error.message
            });
        }
    },
    // deposit
    deposit: async (req, res) => {
        try {
            const {UserID,FullName, Email, Amount} = req.body;
            const userID = req.params.userID;
            // check user
            const user = await User.getAccount(userID);
                if (!user || user.UserID != UserID) {
                    return res.status(404).json({
                        success: false,
                        message: ["User not found or does", "not match with the UserID in the body"]
                    });
                }
            // check amount
            if(!Amount || Amount <= 0) {
                return res.status(400).json(
                    { success: false,
                      message: "Invalid amount (must be greater than 0)"
                    }
                );
            }
            // input validation
            if(!FullName || !Email || !Amount) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required (FullName, Email, Amount)'
                });
            }
            // check for pending deposits
            const [pendingDeposits] = await database.promise().query(
                'SELECT * FROM tbltransactions WHERE UserID = ? AND Type = "Deposit" AND Status = "Pending"',
                [userID]
            );
            if (pendingDeposits.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'You have a pending deposit request. Please wait for it to be processed before making a new deposit.'
                });
            }
             
            const result = await User.deposit({UserID, FullName, Email, Amount});
            res.status(200).json({ 
                success: true,
                message: 'Deposit Pending Approval', 
                data: result 
            });
        } catch (error) {
            res.status(500).json({
                 message: 'Error processing deposit', 
                 error: error.message
         });
        }
    },
    //withdraw
    withdraw: async (req, res) => {
        try {
            const {UserID,FullName, Email, Amount} = req.body;
            const userID = req.params.userID;
            // check user
            const user = await User.getAccount(userID);
                if (!user || user.UserID != UserID) {
                    return res.status(404).json({
                        success: false,
                        message: ["User not found", "or does not match with the UserID in the body"]
                    });
                }
            // check balance
            const balanceData = await User.viewBalanceById(userID);
            const balance = balanceData.balance || 0;
            if(Amount > balance) {
                return res.status(400).json({
                    success: false,
                    message: ['Insufficient funds for this withdrawal', `Current balance: ${balance}`]
                });
            }
            // input validation
            if(!FullName || !Email || !Amount) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required (FullName, Email, Amount)'
                });
            }
            // check for pending withdrawals
            const [pendingWithdrawal] = await database.promise().query(
                'SELECT * FROM tbltransactions WHERE UserID = ? AND Type = "Withdrawal" AND Status = "Pending"',
                [userID]
            );
            if (pendingWithdrawal.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'You have a pending Withdraw request. Please wait for it to be processed before making a new request.'
                });
            }
             
            const result = await User.withdraw({UserID, FullName, Email, Amount});
            res.status(200).json({ 
                success: true,
                message: ['Withdrawal Pending for Approval', 'please go to the nearest bank to receive your cash'], 
                data: result 
            });
        } catch (error) {
            res.status(500).json({
                 message: 'Error processing Withdrawal', 
                 error: error.message
         });
        }
    },
    //viewTransactions
    viewTransactions: async (req, res) => {
        try {
            const userID = req.params.userID;
            const exist = await User.getAccount(userID);
            // check if user exists
            if (!exist) {
                return res.status(404).json({
                    success: false,
                    message: 'User ID not found'
                });
            }
            const transactions = await User.viewTransactionsById(userID);
            // check if user has transaction history
            if (transactions.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No transactions found for this user'
                });
            }
            res.json({
                success: true,
                data: transactions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching data',
                error: error.message
            });
        }
    },
    //viewPendingLoan
    viewPendingLoan: async (req, res) => {
        try {
            const userID = req.params.userID;
            const exist = await User.getAccount(userID);
            // check if user exists
            if (!exist) {
                return res.status(404).json({
                    success: false,
                    message: 'User ID not found'
                });
            }
            const pendingLoan = await User.viewPendingLoanById(userID);
            // check if user has Pending loans
            if (pendingLoan.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No Pending Loan found for this user'
                });
            }
            res.json({
                success: true,
                data: pendingLoan
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching data',
                error: error.message
            });
        }
    },
    //viewActiveLoan
    viewActiveLoan: async (req, res) => {
        try {
            const userID = req.params.userID;
            const exist = await User.getAccount(userID);
            // check if user exists
            if (!exist) {
                return res.status(404).json({
                    success: false,
                    message: 'User ID not found'
                });
            }
            const activeLoan = await User.viewActiveLoans(userID);
            // check if user has active loan
            if (activeLoan.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No Active Loan found for this user'
                });
            }
            res.json({
                success: true,
                data: activeLoan
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching data',
                error: error.message
            });
        }
    },
    //payLoan
    payLoan: async (req, res) => {
        try {
            const {Amount} = req.body;
            const userID = req.params.userID;
            const exist = await User.getAccount(userID);
            // check if user exists
            if (!exist) {
                return res.status(404).json({
                    success: false,
                    message: 'User ID not found'
                });
            }
            // check if user has active loan
            const activeLoan = await User.viewActiveLoans(userID);
            if (activeLoan.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No Active Loan found for this user'
                });
            }
            const balanceData = await User.viewBalanceById(userID);
            const balance = balanceData.balance || 0;

            // check if balance is sufficient
            if (balance < Amount) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient funds to make the loan payment'
                });
            }
            // check if payment exceeds remaining balance
            const remainingBalance = activeLoan[0].RemainingBalance || 0;
            if (Amount > remainingBalance) {
                return res.status(400).json({
                    success: false,
                    message: `Payment failed. The amount exceeds the remaining balance of ${remainingBalance}.`
                });
            }
            // check if loan is already fully paid
            
                if (remainingBalance <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Loan is already fully paid. No payment required.'
                    });
                }
            // process loan payment
            
                await User.payLoan(userID, {Amount});
                res.json({
                    success: true,
                    message: 'Loan payment processed successfully',
                    
                });
            
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error processing loan payment',
                error: error.message
            });
        }
    }
};
module.exports = userController;