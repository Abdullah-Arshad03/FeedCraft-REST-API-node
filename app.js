const express = require('express')
const mongoose = require('mongoose')

const app  = express()
const feedRoutes = require('./routes/feed')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET' , 'POST' , 'PUT' , 'PATCH' , 'DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type' , 'Authorization')
    next()
})


//GET /feed/posts
app.use('/feed', feedRoutes)

mongoose.connect('mongodb://127.0.0.1:27017/blogDb').then((connected)=>{
    console.log('Mongoose Connected!')
    app.listen(8080)
}).catch((err)=>{
    console.log(err)
})




