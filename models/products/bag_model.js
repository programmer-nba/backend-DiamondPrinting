const mongoose = require('mongoose')
const {Schema} = mongoose

const bagSchema = new Schema({ 
    code: String,
    price: Number,
})

const Bag = mongoose.model('Bag', bagSchema)
module.exports = Bag