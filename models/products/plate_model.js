const mongoose = require('mongoose')
const {Schema} = mongoose

const plateSchema = new Schema({ 
    code: String,
    title: {
        type: String,
        default: 'เพลทตัด'
    },
    size: String,
    price: Number
})

const Plate = mongoose.model('Plate', plateSchema)
module.exports = Plate