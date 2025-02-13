const express = require('express')
const { getAllUsers, getUserById, updateUser } = require('../controllers/users')

const { authenticateUser } = require('../middleware/authentication')

const router = express.Router()

router.route('/').get(getAllUsers)
router.route('/update').patch(authenticateUser, updateUser)
router.route('/:id').get(getUserById)

module.exports = router
