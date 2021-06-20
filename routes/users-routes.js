const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

const router = express.Router();


router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('email')
      .normalizeEmail()
      .isEmail(),
    check('password').isLength({ min: 8 })
  ],
  usersController.signup
);

router.post('/login', usersController.login);


module.exports = router;
