const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({ 
    code: String,
    type: String,
    subType: {
        type: String,
        default: ''
    },

    option: [
        {
            gsm: Number,
            width: Number,
            long: Number,
            pkg: Number,
            psheet: Number
        }
    ],

})

const Product = mongoose.model('Product', productSchema)
module.exports = Product