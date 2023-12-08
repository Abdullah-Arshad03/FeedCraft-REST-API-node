const express = require('express')

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



app.listen(8080)

