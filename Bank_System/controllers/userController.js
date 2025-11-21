//david le gabana
const User = require('../models/userModel');

const userController = {
//Get Account Details
getAccountDetails: async (req, res) => {
    try {
        const userID = req.params.id;
        User.getAccountDetails(userID, (err, user) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving user details', error: err });
            }
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        }
        );
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
},
// viewBalance
viewBalance: async (req, res) => {
  try {
    const userId = req.params.id; 
    const balance = await User.viewBalanceById(userId);

    if (balance === null) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ userId, balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving balance', error: err.message });
  }
},

  // update Accountinfo
  updateAccountInfo: async (req, res ) => {
    try {
        const {fullName, balance, age, address, dateofBirth, gender, contactNumber, emailAddress, Status} = req.body;
        const userID = req.params.id;

        const existingUser = await User.findById(userID);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        if (!fullName || !balance || !age || !address || !dateOfBirth || !gender || !contactNumber || !emailAddress || !Status) {
            return res.status(400).json({
                success: false,
                message: 'All fields (fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status) are required'
            });
        }
        await User.updateAccountInfo(userID,
            fullName,
            balance,
            age,
            address,
            dateOfBirth,    
            gender,
            contactNumber,
            emailAddress,
            Status
            );
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
            const {fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status} = req.body;
            
            if (!fullName || !balance || !age || !address || !dateOfBirth || !gender || !contactNumber || !emailAddress || !Status) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields (fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status) are required'
                });
            }
            const newLoanApplication = {
                fullName,
                balance,
                age,
                address,
                dateOfBirth,
                gender,
                contactNumber,
                emailAddress,
                Status
            };
            res.status(201).json({
                success: true,
                message: 'Loan application submitted successfully',
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
            const { userId, Amount } = req.body;
            if (!userId || !Amount || Amount <= 0) {
                return res.status(400).json({ message: 'Invalid user ID or amount' });
            }
            const user = await User.getAccountDetails(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const newBalance = user.Balance + Amount;
            await User.updateAccountInfo({ id: userId, Balance: newBalance });
            res.status(200).json({ 
                message: 'Deposit successful', 
                newBalance 
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
            const { userId, Amount } = req.body;
            if (!userId || !Amount || Amount <= 0) {
                return res.status(400).json({ message: 'Invalid user ID or amount' });
            }
            const user = await User.getAccountDetails(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.balance < Amount) {
                return res.status(400).json({ message: 'Not enough balance' });
            }
            const newBalance = user.Balance - Amount;
            await User.updateAccountInfo({ id: userId, Balance: newBalance });
            res.status(200).json({ 
                message: 'Withdrawal successful', 
                newBalance 
            });
        } catch (error) {
            res.status(500).json({
                 message: 'Error processing withdrawal', 
                 error: error.message
         });
        }
    }
};

module.exports = userController;