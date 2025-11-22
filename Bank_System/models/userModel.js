//david la gabana

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
        resolve(results);
      });
    });
  },

  // updateAccountInfo
  updateAccountInfo: (UserID, userData) => {
    return new Promise((resolve, reject) => {
      const {fullName, age, address, dateOfBirth, gender, contactNumber, emailAddress} = userData;
      database.query( 'UPDATE tblusers SET fullName = ?, age = ?, address = ?, dateOfBirth = ?, gender = ?, contactNumber = ?, emailAddress = ? WHERE UserID = ?',
    [fullName, age, address, dateOfBirth, gender, contactNumber, emailAddress, UserID],
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
      const {fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status} = userData;
      database.query('INSERT INTO tblloans (UserID, LoanAmount, MonthsToPay, Reason, MonthlyIncome, Date) VALUES (?, ?, ?, ?, ?, ?)',
    [fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status],
      (err, results) => {
        if (err) return reject(err);
        resolve({id: results.insertId, ...userData});
      }
      );
    });
  },
  //deposit
  deposit: (transactionData) => {
    return new Promise((resolve, reject) => {
      const {UserID, FullName, Email, Type, Amount, Status, Date} = transactionData;
      database.query('Insert tbltransactions (UserID, FullName, Email, Type, Amount, Status, Date) VALUES (?, ?, ?, "Deposit", ?, "Pending", CURDATE())', 
        [UserID, FullName, Email, Type, Amount, Status, Date], 
        (err, results) => {
        if (err) return reject(err);
        resolve({id: results.insertId, ...transactionData});
      });
    });
  },
  //withdraw
  withdraw: (transactionData) => { 
    return new Promise((resolve, reject) => {
      const {UserID, FullName, Email, Type, Amount, Status, Date} = transactionData;
      database.query('Insert tbltransactions (UserID, FullName, Email, Type, Amount, Status, Date) VALUES (?, ?, ?, "Withdrawal", ?, "Pending", CURDATE())', 
        [UserID, FullName, Email, Type, Amount, Status, Date], 
        (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) {
          return reject(new Error('Not enough funds or user not found'));
        }
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
  }
};

module.exports = User;
