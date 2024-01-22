const express = require('express')

const router = express.Router()
const profileController = require('../controller/profile')
const isAuth = require('../middleware/is-auth')


router.get('/posts',isAuth, profileController.getProfile)


module.exports = router