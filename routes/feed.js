const express = require('express')

const { check } = require('express-validator')
const isAuth = require('../middleware/is-auth')

const router = express.Router()
const feedController = require('../controller/feed')

router.get('/posts', isAuth ,  feedController.getPosts)

router.post('/post',[
    check('title','title must contain atleast 5 characters!').trim().isLength({min : 5}),
    check('content', 'content must contain atleast 5 characters!').trim().isLength({min : 5})
], isAuth ,feedController.createPost)

router.get('/post/:postId' , isAuth ,feedController.getPost)

// this route is for editing the post
router.put('/post/:postId', [
    check('title','title must contain atleast 5 characters!').trim().isLength({min : 5}),
    check('content', 'content must contain atleast 5 characters!').trim().isLength({min : 5})
] ,isAuth , feedController.editPost)

router.delete('/post/:postId',isAuth, feedController.deletePost)

router.get('/status', isAuth ,feedController.getStatus)

router.patch('/status', isAuth , feedController.updateUserStatus)


module.exports = router