//david la gabana

const database = require('./database');

const User = {
  // Get Account Details by ID
  getAccountDetails: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0]);
      });
    });
  },

  // GET view Balance by ID
  viewBalanceById: (id) => {
    return new Promise((resolve, reject) => {
      database.query('SELECT balance FROM users WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0].Balance);
      });
    });
  },

  // updateAccountInfo
  updateAccountInfo: (userData) => {
    return new Promise((resolve, reject) => {
      const {fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status, id} = userData;
      database.query = 'UPDATE users SET fullName = ?, balance = ?, age = ?, address = ?, dateOfBirth = ?, gender = ?, contactNumber = ?, emailAddress = ?, Status = ? WHERE id = ?',
    [fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status, id],
      (err, results) => {
        if (err) return reject(err);
        resolve({id: id, ...userData});
      }
    });
  },
  // applyLoan
  applyLoan: (userData) => {
    return new Promise((resolve, reject) => {
      const {fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status} = userData;
      database.query = 'INSERT INTO loans (fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [fullName, balance, age, address, dateOfBirth, gender, contactNumber, emailAddress, Status],
      (err, results) => {
        if (err) return reject(err);
        resolve({id: results.insertId, ...userData});
      }
    });
  },
  //deposit
  deposit: (UserID, Amount) => {
    return new Promise((resolve, reject) => {
      database.query('UPDATE users SET Balance = Balance + ? WHERE id = ?', 
        [Amount, UserID], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  //withdraw
  withdraw: (UserID, Amount) => { 
    return new Promise((resolve, reject) => {
      database.query('UPDATE users SET Balance = Balance - ? WHERE id = ? AND Balance >= ?', 
        [Amount, UserID, Amount], (err, results) => {
        if (err) return reject(err);
        if (results.affectedRows === 0) {
          return reject(new Error('Not enough funds or user not found'));
        }
        resolve(results);
      });
    });
  }
};

module.exports = User;
