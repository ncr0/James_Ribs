const express = require('express'); //library
const cors = require('cors'); // cross origin - limited access
require('dotenv').config(); // environment variables
const UserRoutes = require('./routes/userRoute');
const AdminRoutes = require('./routes/adminRoute');

const app = express();
const PORT = process.env.PORT;// Default port 3000

// Middleware
app.use(cors()); //app.use(cors('google.com')); --> only google.com can access
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // security purposes for url

// Routessasdasd
app.use('/api/User', UserRoutes);
app.use('/api/admin', AdminRoutes);
// app.get('/', (req, res) => {




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
//   console.log(`API URL: http://localhost:${PORT}/api/students`);
});