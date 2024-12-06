const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const app = express();
const PORT = 3000;

// MongoDB connection URL (Update with your actual MongoDB URI)
const DB_URL = "mongodb+srv://PhilipGSanova:shieldsanova@clusternodejstrial.yoebz.mongodb.net/loginAppDB?retryWrites=true&w=majority&appName=ClusterNodeJSTrial"

// Connect to MongoDB
mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// Database connection success and error handling
conn.once('open', () => {
  console.log('Successfully connected to the database');
});

conn.on('error', () => {
  console.log('Error connecting to the database');
  process.exit();
});

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Set view engine to EJS
app.set('view engine', 'ejs');

// User model definition
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Render the login page
app.get('/', (req, res) => {
  res.render('index'); // Renders `views/index.ejs`
});

// Handle form submission (POST request)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    try {
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user and save to the database
      const newUser = new User({
        username: username,
        password: hashedPassword
      });

      // Save the user to the database
      await newUser.save();

      res.send('User registered successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error saving user details');
    }
  } else {
    res.status(400).send('Both fields are required.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
