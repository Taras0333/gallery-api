const express = require('express')
const { getAllPictures } = require('../controllers/pictures')

const router = express.Router()

router.route('/').get(getAllPictures)

module.exports = router
