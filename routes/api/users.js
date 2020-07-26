const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');

const router = express.Router();

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // Validate user does not already exist
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm', // default
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      // Encrypting password before storing in mongoDB
      const salt = await bcrypt.genSalt(10); // 10 rounds for generating salt
      user.password = await bcrypt.hash(password, salt);

      // Save user to mongoDB
      await user.save();

      const token = jwt.sign(
        {
          user: {
            id: user.id,
          },
        },
        config.get('jwt.privateKey'),
        {
          expiresIn: '30d',
          // issuer: '',
          // subject: '',
          // audience: '',
        },
      );
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
