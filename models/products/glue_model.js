const mongoose = require('mongoose')
const {Schema} = mongoose

const glueSchema = new Schema({ 
    code: String,
    glueAvr: Number,
    glueDot: Number
})

const Glue = mongoose.model('Glue', glueSchema)
module.exports = Glue