const express = require('express');
const router = express.Router();
const { register, login, getMe, softRegister, registerCreator } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/soft-register', softRegister);
router.post('/register-creator', registerCreator);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
