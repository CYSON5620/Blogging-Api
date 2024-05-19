const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Ensure this path is correct
const auth = require('../middleware/auth'); // Ensure this middleware exists and is correctly implemented
const config = require('../config'); // Ensure this file contains the correct JWT secret

const router = express.Router();

// Signup route
router.post('/users/signup', async (req, res) => {
  const { name, email, password } = req.body; // Destructure required fields for clarity

  // Validate request body here if needed

  const newUser = new User({
    name,
    email,
    password, // Assuming the User model handles hashing passwords
  });

  try {
    await newUser.save(); // Save the new user
    const token = jwt.sign({ _id: newUser._id.toString() }, config.jwtSecret, { expiresIn: '1h' }); // Convert _id to string for consistency
    res.status(201).json({ user: newUser, token }); // Use.json() for sending JSON response
  } catch (error) {
    console.error(error); // Log errors for debugging
    res.status(400).json({ error: 'Error signing up' }); // Send a generic error message
  }
});

// Login route
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('_id').exec(); // Populate _id to get full user object
    if (!user) {
      return res.status(400).json({ error: 'Invalid login credentials' }); // Return early if user not found
    }

    // Assuming comparePassword is a method on the User model that checks the password
    if (!(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid login credentials' }); // Return early if password does not match
    }

    const token = jwt.sign({ _id: user._id.toString() }, config.jwtSecret, { expiresIn: '1h' }); // Convert _id to string for consistency
    res.json({ user, token }); // Use.json() for sending JSON response
  } catch (error) {
    console.error(error); // Log errors for debugging
    res.status(500).json({ error: 'Server error' }); // Send a generic server error message
  }
});

module.exports = router;

