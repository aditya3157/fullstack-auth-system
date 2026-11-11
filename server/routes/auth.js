const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithPassword,
  updateUserProfile,
  updateUserPassword,
  getAllUsers
} = require('../database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Email regex pattern for basic validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, bio, phone, location, avatar_url } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in SQLite
    const newUser = createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      bio: bio ? bio.trim() : '',
      phone: phone ? phone.trim() : '',
      location: location ? location.trim() : '',
      avatar_url: avatar_url ? avatar_url.trim() : ''
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again.'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user by email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare safe user object (exclude password)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      location: user.location,
      avatar_url: user.avatar_url,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again.'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 * @access  Private
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile details
 * @access  Private
 */
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { name, bio, phone, location, avatar_url } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
    }

    const updatedUser = updateUserProfile(req.user.id, {
      name: name.trim(),
      bio: bio !== undefined ? bio.trim() : req.user.bio,
      phone: phone !== undefined ? phone.trim() : req.user.phone,
      location: location !== undefined ? location.trim() : req.user.location,
      avatar_url: avatar_url !== undefined ? avatar_url.trim() : req.user.avatar_url
    });

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.'
    });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change current user password
 * @access  Private
 */
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    // Retrieve user with password
    const userWithPassword = findUserByIdWithPassword(req.user.id);
    if (!userWithPassword) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, userWithPassword.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    updateUserPassword(req.user.id, hashedPassword);

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update password.'
    });
  }
});

/**
 * @route   GET /api/auth/users
 * @desc    List all registered users (for demonstration/monitoring)
 * @access  Public
 */
router.get('/users', (req, res) => {
  try {
    const users = getAllUsers();
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
});

module.exports = router;
