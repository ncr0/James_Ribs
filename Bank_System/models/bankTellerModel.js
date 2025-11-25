const db = require('../database');


const Admin = {
  // Get All Users
  getAllUser: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tblusers',(err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  // Get User by ID
  getUserByID: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tblusers WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },
  // Get User by Status
  getUserByStatus: (status) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tblusers WHERE Status = ?', [status], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  // Create New User Account
    createUser: (userData) => {
    return new Promise((resolve, reject) => {
      const { UserID, FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress } = userData;
      db.query(
        'INSERT INTO tblusers (UserID, FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, "Active")',
        [UserID, FullName, Age, Address, DateofBirth, Gender, ContactNumber, EmailAddress],
        (err, results) => {
          if (err) reject(err);
          resolve({ id: results.insertId, ...userData });
        }
      );
    });
  },
  // Delete User Account
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM tblusers WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  
  // GET Transactions by transactionID - helps with deposit/withdrawal approval
  getTransactionByTransactionID: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbltransactions WHERE TransactionID = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },
  // Approve Deposit 
  approveDeposit: (transactionID) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbltransactions WHERE TransactionID = ?', [transactionID], (err, results) => {
        if (err) reject(err);
        
        const {UserID, Amount, status} = results[0];
        
        db.query('UPDATE tbltransactions SET Status = "Approved" WHERE TransactionID = ?', [transactionID], (err, statusResult) => {
          if (err) return reject(err);

        db.query('UPDATE tblusers SET Balance = Balance + ? WHERE UserID = ?', [Amount, UserID], (err) => {
          if (err) return reject(err);
        
        resolve({
          TransactionID: transactionID,
          UserID: UserID,
          Amount: Amount,
          Status: 'Approved'});
      });
    });
        
    });
  
  });
  },

  // Approve Deposit 
  approveWithdrawal: (transactionID) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbltransactions WHERE TransactionID = ?', [transactionID], (err, results) => {
        if (err) reject(err);
        
        const {UserID, Amount, status} = results[0];
        
        db.query('UPDATE tbltransactions SET Status = "Approved" WHERE TransactionID = ?', [transactionID], (err, statusResult) => {
          if (err) return reject(err);

        db.query('UPDATE tblusers SET Balance = Balance - ? WHERE UserID = ?', [Amount, UserID], (err) => {
          if (err) return reject(err);
        
        resolve({
          TransactionID: transactionID,
          UserID: UserID,
          Amount: Amount,
          Status: 'Approved'});
      });
    });
  
    });
  
  });
  },

  // Get Loan By Loan ID - helps approve loan
  // getLoanByLoanID: (id) => {
  //   return new Promise((resolve, reject) => {
  //     db.query('SELECT * FROM tblloans WHERE LoanID = ?', [id], (err, results) => {
  //       if (err) reject(err);
  //       resolve(results[0]);
  //     });
  //   });
  // },

  // Approve Loan
  approveLoan: (UserID, loanData) => {
    return new Promise((resolve, reject) => {
      
      const {InterestRate, totalAmount, MonthlyPayment} = loanData;
      db.query( 'UPDATE tblloans SET InterestRate = ?, totalAmount = ?, MonthlyPayment = ?, RemainingBalance = ?, Status = "Active" WHERE UserID = ?',
    [InterestRate, totalAmount, MonthlyPayment, totalAmount, UserID],
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
      );
    });
  },
  // Get All Transactions
  getAllTransactions: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbltransactions',(err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  // GET Transactions by UserID 
  getTransactionByID: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbltransactions WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },
  // GET Transactions by Type
  getTransactionByType: (type) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbltransactions WHERE Type = ?', [type], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  // Get Transactions by Status
  getTransactionByStatus: (status) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tbltransactions WHERE Status = ?', [status], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  // Get All Loans
  getAllLoans: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tblloans',(err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  // GET Loan by UserID 
  getLoanByID: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tblloans WHERE UserID = ?', [id], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  },
  // Get Loans by Status
  getLoanByStatus: (status) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM tblloans WHERE Status = ?', [status], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
}
module.exports = Admin;