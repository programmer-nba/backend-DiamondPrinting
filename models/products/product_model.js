const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({ 
    code: String,
    type: String,

    option: [
        {
            title: String,
            name: String,
            unit: String,
            ppu: Number
        }
    ],

})

const Product = mongoose.model('Product', productSchema)
module.exports = Product