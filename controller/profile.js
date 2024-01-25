const Post = require('../models/post')


exports.getProfile = async (req, res, next)=>{
    
try{
   const posts = await Post.find({creator : req.user}).populate('creator')

   if(!posts){
    const error = new Error('The User isnt Authorized!')
    error.statusCode = 403 // code for the forbiden, means resource isnt belong to the user
    throw error
   }
   res.status(200).json({
    message :'the logged in users posts are here',
    posts : posts
   })
}
catch(error){
    if(!error.statusCode){
        error.statusCode = 500
    }
    next (error)
}
}