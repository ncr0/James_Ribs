const db = require('../database');
const { get } = require('../routes/bankTellerRoute');

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
  
  // Approve Deposit - to be added later

  // Approve Withdrawal - to be added later

  // Approve Loan - to be added later

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