const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateRequest, schemas } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', validateRequest(schemas.signupSchema), registerUser);
router.post('/login', validateRequest(schemas.loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
