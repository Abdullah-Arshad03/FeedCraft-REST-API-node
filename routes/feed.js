const express = require('express')

const { check } = require('express-validator')

const router = express.Router()
const feedController = require('../controller/feed')

router.get('/posts', feedController.getPost)

router.post('/post',[
    check('title','title must contain atleast 5 characters!').trim().isLength({min : 5}),
    check('content', 'content must contain atleast 5 characters!').trim().isLength({min : 5})
], feedController.createPost)



module.exports = router