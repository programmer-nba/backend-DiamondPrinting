const mongoose = require('mongoose')
const {Schema} = mongoose

const coatingSchema = new Schema({ 
    code: String,
    type: String,
    subType: String,
    option: [
        {
            width: Number,
            long: Number,
            unit: String,
            avr: Number,
            minPrice: Number
        }
    ]
})

const Coating = mongoose.model('Coating', coatingSchema)
module.exports = Coating