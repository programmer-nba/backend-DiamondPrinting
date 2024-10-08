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
app.use('/daimond/cal', require('./routes/cal_route.js'))
app.use('/daimond/filter', require('./routes/filter_route.js'))
app.use('/daimond/order', require('./routes/order_route.js'))
app.use('/daimond/file', require('./routes/file_route.js'))
app.use('/daimond/admin', require('./routes/admin_route.js'))
app.use('/daimond/schedule', require('./routes/schedule_route.js'))
app.use('/daimond/profits', require('./routes/profit_route.js'))

//const mongoDBUrl = process.env.MONGODB_URL
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