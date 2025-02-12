const express = require('express')
const {
  register,
  login,
  verifyByEmail,
  forgotPassword,
  resetPassword,
  logout,
} = require('../controllers/auth')
const { authenticateUser } = require('../middleware/authentication')

const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify-email').get(verifyByEmail)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(authenticateUser, resetPassword)
router.route('/logout').delete(logout)

module.exports = router
