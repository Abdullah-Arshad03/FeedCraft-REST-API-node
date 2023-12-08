exports.getPost = (req , res , next ) =>{
    res.status(200).json({
        "message" : "This is the message from the get post route",
        posts : [{
            title : 'This is the title of my first post',
            content : 'content of first post'
        } , 
        {
            title : 'second title',
            content : 'content of the second post'
        }]
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
            content : content
        }

    })


}
