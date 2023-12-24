const mongoose = require('mongoose')
const {Schema} = mongoose

const coatingSchema = new Schema({ 
    code: String,
    method: String,
    title: {
        type: String,
        default: 'วิธีเคลือบ'
    },
    option: [
        {
            subType: {
                type: String,
                default: ''
            },
            avr: Number,
            minPrice: Number
        }
    ]
})

const Coating = mongoose.model('Coating', coatingSchema)
module.exports = Coating