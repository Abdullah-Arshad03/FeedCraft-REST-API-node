const express = require('express')

const router = express.Router()
const feedController = require('../controller/feed')


router.get('/posts', feedController.getPost)

router.post('/post', feedController.createPost)


module.exports = router