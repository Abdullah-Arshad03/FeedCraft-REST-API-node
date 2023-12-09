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
    const title = req.body.title
    const content = req.body.content

    res.status(201).json({
        message : 'Post created Successfully',
        post : {
            id : new Date().toISOString(),
            title : title ,
            content : content,
            creator : {
                name : 'Abdullah bin Arshad'
            },
            createdAt : new Date()
        }

    })


}
