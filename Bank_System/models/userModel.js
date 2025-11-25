const database = require('../database');

const User = {
  // Get Account Details by ID
  getAccount: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM tblusers WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },

  // GET view Balance by ID
  viewBalanceById: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT balance FROM tblusers WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
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
      const {userID, LoanAmount, MonthsToPay, Reason, MonthlyIncome} = userData;
      database.query('INSERT INTO tblloans (UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome, Date, Status) VALUES (?, ?, ?, ?, ?, CURDATE(), "Pending")',
    [userID, LoanAmount, MonthsToPay, Reason, MonthlyIncome],
      (err, results) => {
        if (err) reject(err);
        resolve({id: results.insertId, ...userData});
      }
      );
    });
  },
  // Deposit
  deposit: (transactionData) => {
    return new Promise((resolve, reject) => {
      const {userID, FullName, Email, Amount} = transactionData;
      database.query('Insert INTO tbltransactions (UserID, FullName, Email, Amount, Type, Status, DateofTransaction) VALUES (?, ?, ?, ?, "Deposit", "Pending", CURDATE())', 
        [userID, FullName, Email, Amount], 
        (err, results) => {
        if (err) reject(err);
        resolve({TransactionID: results.insertId, ...transactionData});
      });
    });
  },
  // View Pending Deposit
  viewPendingDeposit: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM tbltransactions WHERE UserID = ? AND Type = "Deposit" AND Status = "Pending"', [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
  },
  // Withdraw
  withdraw: (transactionData) => { 
    return new Promise((resolve, reject) => {
      const {userID, FullName, Email, Amount} = transactionData;
      database.query('Insert INTO tbltransactions (UserID, FullName, Email, Amount, Type, Status, DateofTransaction) VALUES (?, ?, ?, ?, "Withdrawal", "Pending", CURDATE())', 
        [userID, FullName, Email, Amount], 
        (err, results) => {
        if (err) reject(err);
        resolve({TransactionID: results.insertId, ...transactionData});
      });
    });
  },
  // View Pending Withdrawal
  viewPendingWithdrawal: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM tbltransactions WHERE UserID = ? AND Type = "Withdrawal" AND Status = "Pending"', [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    })
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
  // Pay loan 
  payLoan: (userID, loanData) => {
  const { Amount } = loanData;

  return new Promise((resolve, reject) => {

    // update loan remaining balance
    database.query('UPDATE tblloans SET RemainingBalance = RemainingBalance - ? WHERE UserID = ? AND Status = "Active"',
      [Amount, userID],
      (err, loanUpdate) => {
      if (err) return reject(err);

      // update user balance
      database.query('UPDATE tblusers SET Balance = Balance - ? WHERE UserID = ?',
          [Amount, userID],
          (err, balanceUpdate) => {
          if (err) return reject(err);

            // check balance
          database.query('SELECT RemainingBalance FROM tblloans WHERE UserID = ? AND Status = "Active"',
          [userID],
          (err, checkResult) => {
          if (err) return reject(err);

          const remaining = checkResult[0]?.RemainingBalance || 0;

          // update loan status if fully paid
          if (remaining <= 0) {
          database.query('UPDATE tblloans SET Status = "Finished" WHERE UserID = ? AND Status = "Active"',
          [userID],
          (err, finishUpdate) => {
          if (err) return reject(err);

          return resolve({
            loanUpdated: loanUpdate,
            balanceUpdated: balanceUpdate,
            loanFinished: true
          });
          }
          );
          } else {
              return resolve({
                loanUpdated: loanUpdate,
                balanceUpdated: balanceUpdate,
                loanFinished: false
              });
            }
          }
          )
          }
      );
      }
    );
  });

  },
  // updateLoanstatus
}


  
  
module.exports = User;
