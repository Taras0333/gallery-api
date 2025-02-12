const express = require('express')
const {
  register,
  login,
  verifyByEmail,
  logout,
} = require('../controllers/auth')
const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/verify-email').get(verifyByEmail)
router.route('/logout').delete(logout)

module.exports = router
