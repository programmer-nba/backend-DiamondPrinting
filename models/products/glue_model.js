const mongoose = require('mongoose')
const {Schema} = mongoose

const glueSchema = new Schema({ 
    code: String,
    avr: Number
})

const Glue = mongoose.model('Glue', glueSchema)
module.exports = Glue