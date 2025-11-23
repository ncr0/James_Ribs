const database = require('../database');

const User = {
  // Get Account Details by ID
  getAccount: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM tblusers WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        // if (results.length === 0) return resolve(null);
        resolve(results[0]);
      });
    });
  },

  // GET view Balance by ID
  viewBalanceById: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT balance FROM tblusers WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        // if (results.length === 0) return resolve(null);
        resolve(results[0]);
      });
    });
  },

  // updateAccountInfo
  updateAccountInfo: (UserID, userData) => {
    return new Promise((resolve, reject) => {
      
      const {FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress} = userData;
      database.query( 'UPDATE tblusers SET FullName = ?, Age = ?, Address = ?, DateOfBirth = ?, Gender = ?, ContactNumber = ?, EmailAddress = ? WHERE UserID = ?',
    [FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress, UserID],
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
      );
    });
  },
  // applyLoan
  applyLoan: (userData) => {
    return new Promise((resolve, reject) => {
      const {UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome, Date, Status} = userData;
      database.query('INSERT INTO tblloans (UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome, Date, Status) VALUES (?, ?, ?, ?, ?, CURDATE(), "Pending")',
    [UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome, Date, Status],
      (err, results) => {
        if (err) reject(err);
        resolve({id: results.insertId, ...userData});
      }
      );
    });
  },
  //deposit
  deposit: (transactionData) => {
    return new Promise((resolve, reject) => {
      const {UserID, FullName, Email, Amount, Type, Status, DateofTransaction} = transactionData;
      database.query('Insert INTO tbltransactions (UserID, FullName, Email, Amount, Type, Status, DateofTransaction) VALUES (?, ?, ?, ?, "Deposit", "Pending", CURDATE())', 
        [UserID, FullName, Email, Amount, Type, Status, DateofTransaction], 
        (err, results) => {
        if (err) reject(err);
        resolve({id: results.insertId, ...transactionData});
      });
    });
  },
  //withdraw
  withdraw: (transactionData) => { 
    return new Promise((resolve, reject) => {
      const {UserID, FullName, Email, Amount, Type, Status, DateofTransaction} = transactionData;
      database.query('Insert INTO tbltransactions (UserID, FullName, Email, Amount, Type, Status, DateofTransaction) VALUES (?, ?, ?, ?, "WITHDRAWAL", "Pending", CURDATE())', 
        [UserID, FullName, Email, Amount, Type, Status, DateofTransaction], 
        (err, results) => {
        if (err) reject(err);
        resolve({id: results.insertId, ...transactionData});
      });
    });
  },
  //GET viewTransactionsById
  viewTransactionsById: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM tbltransactions WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  },
  //GET viewPendingLoanById 
  viewPendingLoanById: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM tblloans WHERE UserID = ? AND Status = "Pending"', [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  },
  //GET viewActiveLoans 
  viewActiveLoans: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM tblloans WHERE UserID = ? AND Status = "Active"', [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  },
  // pay loan 
  payLoan: (userID, loanData) => {
    const {Amount} = loanData;
    return new Promise((resolve, reject) => {
      
      // update loan remaining balance
        database.query('UPDATE tblloans SET RemainingBalance = RemainingBalance - ? WHERE UserID = ? AND Status = "Active"',
      [Amount, userID],
      (err, loanResult) => {
        if (err) return reject(err);

        // update user balance
        database.query('UPDATE tblusers SET Balance = Balance - ? WHERE UserID = ?',
          [Amount, userID],
          (err, userResult) => {
            if (err) return reject(err);

            // 3. Resolve promise with both results
            resolve({
              loanUpdated: loanResult,
              balanceUpdated: userResult
            });
          }
        );
      }
    
      
    )
  })
  }
}

  
  
module.exports = User;
