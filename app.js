const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const multer = require('multer')

const app  = express()
const feedRoutes = require('./routes/feed')
const bodyParser = require('body-parser')

const fileStorage = multer.diskStorage({
    destination : (req, file , cb)=>{
        cb(null , 'images')
    },
    filename : (req,file,cb)=>{
        cb(null , file.filename )
    }
})

const fileFilter = (req, file , cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null , true)
    }
    else{
        cb(null , false)
    }
}


app.use(bodyParser.json())
app.use(multer({storage :fileStorage   , fileFilter: fileFilter }).single('image'))
app.use ('/images', express.static(path.join(__dirname , 'images')))

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET' , 'POST' , 'PUT' , 'PATCH' , 'DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type' , 'Authorization')
    next()
})


//GET /feed/posts
app.use('/feed', feedRoutes)

app.use((error,req,res,next)=>{
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    res.status(status).json({
        message : message,
        statusCode : status
    })
})

mongoose.connect('mongodb://127.0.0.1:27017/blogDb').then((connected)=>{
    console.log('Mongoose Connected!')
    app.listen(8080)
}).catch((err)=>{
    console.log(err)
})




