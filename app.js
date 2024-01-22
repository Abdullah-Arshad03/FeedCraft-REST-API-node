const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')

const app  = express()
const feedRoutes = require('./routes/feed')
const authRoutes = require('./routes/auth')
const profileRoutes = require("./routes/profile")

const bodyParser = require('body-parser')
let random = new Date().getTime().toString()

const fileStorage = multer.diskStorage({
    destination : (req, file , cb)=>{
        cb(null , './images')
    },
    filename : (req,file,cb)=>{
        cb(null , random + file.originalname )
    }
})

const fileFilter = (req, file , cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null , true)
    }
    else{
        cb(null , false)
        console.log('else block')
    }
}

app.use(bodyParser.json())
app.use(multer({storage :fileStorage   , fileFilter: fileFilter }).single('image'))
app.use ('/images', express.static(path.join(__dirname , 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()

});

app.use('/auth',authRoutes)
//GET /feed/posts
app.use('/feed', feedRoutes)

app.use('/profile', profileRoutes)

app.use((error,req,res,next)=>{
    console.log(error)
    // console.log('hello')
    const status = error.statusCode || 500
    const message = error.message // this is default term in the error , the string we pass in the Error('')is treated as the error.message by default
    const messages = error.messages
    res.status(status).json({
        message : message,
        statusCode : status,
        messages : messages
    })
})

mongoose.connect('mongodb://127.0.0.1:27017/blogDb').then((connected)=>{
    console.log('Mongoose Connected!')
    app.listen(8080)
}).catch((err)=>{
    console.log(err)
})




