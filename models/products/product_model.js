const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({ 
    code: String,
    type: String,

    option: [
        {
            name: String,
            ppu: Number
        }
    ],

    unit: String
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product