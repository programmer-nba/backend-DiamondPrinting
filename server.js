const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

// routes here
app.use('/daimond/auth', require('./routes/auth_route.js'))
app.use('/daimond/product', require('./routes/product_route.js'))

const mongoDBUrl = process.env.MONGODB_URL
const port = process.env.PORT || 7078
mongoose.connect( mongoDBUrl )
.then(()=>{
    console.log('♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥')
    console.log('► connected to mongodb      ◄')
    app.listen(port, ()=>{
        console.log(`► listening on port [${port}]  ◄`)
        console.log('♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥ ♥')
    })
})
.catch(err => console.log('error connecting', err))