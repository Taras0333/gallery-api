const express = require('express')
const {
  getAllUsers,
  getUserById,
  getUserPaswords,
} = require('../controllers/users')

const { authenticateUser } = require('../middleware/authentication')

const router = express.Router()

router.route('/').get(getAllUsers)
router.route('/passwords').get(authenticateUser, getUserPaswords)
router.route('/:id').get(getUserById)

module.exports = router
