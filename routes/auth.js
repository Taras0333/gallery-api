const express = require('express')
const {
  register,
  login,
  verifyByEmail,
  forgotPassword,
  logout,
} = require('../controllers/auth')
const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify-email').get(verifyByEmail)
router.route('/forgot-password').post(forgotPassword)
router.route('/logout').delete(logout)

module.exports = router
