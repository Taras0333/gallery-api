const express = require('express')
const { register, login, verifyEmail, logout } = require('../controllers/auth')
const router = express.Router()

router.route('/register').post(register)
router.route('/login').post(login)
// router.route('/verify-email').post(verifyEmail)
router.route('/logout').delete(logout)

module.exports = router
