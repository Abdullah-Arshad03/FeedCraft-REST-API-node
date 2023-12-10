const {validationResult} = require('express-validator')

const Post = require('../models/post')


exports.getPost = (req , res , next ) =>{
    res.status(200).json({
        "message" : "This is the message from the get posts route",
        posts : [{
            _id :'1', // in reality it will be the moongoose id from the database but now adding dummy one
            title : 'This is the title of my first post',
            content : 'content of first post',
            imageUrl : 'images/coffee.jpg',
            creator : {
                name : 'Abdullah Bin Arshad'
            },
            createdAt : new Date()  
        } 
      ]
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
        // return res.status(422).json({
        //     message : 'Validation failed, entered data is incorrect!',
        //     errors : errors.array()
        // })
    }
   const post = new Post({
       title : title ,
       content : content,
       imageUrl :'images/coffee',
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
