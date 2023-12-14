const jwt = require('jsonwebtoken')

module.exports = (req, res , next) =>{
   const token = req.get('Authorization').split(' ')[1]
   console.log(token)
   // now we decode this token received from the frontend
   let decodedToken;

   try{
    decodedToken = jwt.verify(token , 'somesupersecret')
   }catch(err){
    err.statusCode = 500
    throw err
   }
   if(!decodedToken){
    const error = new Error('not Authenticated!')
    error.statusCode = 401
    throw error
   }

   req.user = decodedToken.userId 
   next()

}