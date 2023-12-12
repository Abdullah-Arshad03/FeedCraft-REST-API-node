const {validationResult} = require('express-validator')
const fs = require('fs')
const path = require('path')

const Post = require('../models/post')
const { ValidationHalt } = require('express-validator/src/base')


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
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422 ;
        throw error

    }
    if(!req.file){
        const error = new Error('The image isnt added!')
        error.statusCode = 422
        throw error
    }
    const imageUrl = req.file.path
    const imgObj = req.file
    console .log(imgObj)


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

exports.editPost = () =>{
    const postId = req.params.postId
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        const error = new Error(errors.array()[0].msg)
        error.statusCode = 422
        throw error
    }
    const title = req.body.title
    const content = req.body.content
    let imageUrl = req.body.image

    if(req.file){
        imageUrl = req.file.path
    }
    if(!imageUrl){
    const error = new Error('no image is provided !')
    error.statusCode = 422
    throw error
    }
    Post.findById(postId).then((post)=>{
        if (!post){
            const error = new Error('post isnt found in the database')
            error.statusCode = 404
            throw error
        }
        if(imageUrl != post.imageUrl){
            clearImage(post.imageUrl)
        }
        post.title = title
        post.content = content
        post.imageUrl = imageUrl
        return post.save()
    }).then((result)=>{
        res.status(200).json({message : 'post is updated successfully !', post : result})
    }).catch(err =>{
        next(err)
    })

}

//creating a helper function now 

const clearImage = (filepath) =>{
     filepath = path.join(__dirname , '..' , filepath)
     fs.unlink(filePath , err =>{console.log(err)})
}