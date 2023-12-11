const {validationResult} = require('express-validator')

const Post = require('../models/post')


exports.getPosts = (req , res , next ) =>{

    Post.find().then((posts)=>{
        if(!posts){
            const error = new Error ('Posts arent fetched from the DB')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({
            message : ' all posts fetched successfully',
            posts : posts
        })
    }).catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })
}

// now making the post request

exports.createPost = (req, res , next) =>{
    // lets assume this will the post created in the Database.
    const errors = validationResult(req)
    const title = req.body.title
    const content = req.body.content

    if(!errors.isEmpty()){
        const error = new Error('Validation Failed, entered data is incorrect!');
        error.statusCode = 422 ;
        throw error

    }
    if(!req.file){
        const error = new Error('The image isnt added!')
        error.statusCode = 422
        throw error
    }
    const imageUrl = req.file.path


   const post = new Post({
       title : title ,
       content : content,
       imageUrl : imageUrl,
       creator : { name : 'Abdullah Bin Arshad 03'}
   })
   post.save().then((result)=>{
    res.status(201).json({
        message : 'Post created Successfully',
        post : result
    })
   }).catch(err =>{
    if(!err.statusCode){
        err.statusCode = 500
    }
    next(err)
   })
}


exports.getPost = (req,res,next)=>{
    const postId = req.params.postId
    Post.findById(postId).then((post)=>{
        if(!post){
            const error = new Error('the post isnt found')
            error.statusCode = 404
            throw error
        }
       res.status(200).json({
            message : 'post fetched successfully',
            post : post
        })

    }

    ).catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err)
    })

}