const express = require('express')

const { check } = require('express-validator')

const router = express.Router()
const feedController = require('../controller/feed')

router.get('/posts', feedController.getPosts)

router.post('/post',[
    check('title','title must contain atleast 5 characters!').trim().isLength({min : 5}),
    check('content', 'content must contain atleast 5 characters!').trim().isLength({min : 5})
], feedController.createPost)

router.get('/post/:postId' , feedController.getPost)

// this route is for editing the post
router.put('/post/:postId', [
    check('title','title must contain atleast 5 characters!').trim().isLength({min : 5}),
    check('content', 'content must contain atleast 5 characters!').trim().isLength({min : 5})
] , feedController.editPost)

router.delete('/post/:postId', feedController.deletePost)


module.exports = router