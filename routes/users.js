const express = require('express')
const { getAllUsers, getUserById } = require('../controllers/users')

const router = express.Router()

router.route('/').get(getAllUsers)
router.route('/:id').get(getUserById)

module.exports = router
