const mongoose = require('mongoose')
const {Schema} = mongoose

const printSchema = new Schema({ 
    code: String,
    title: {
        type: String,
        default: 'จำนวนสี'
    },
    colors: Number,
    option: [
        {
            round: {
                start: Number,
                end: Number,
                join: String
            },
            price: Number
        }
    ]
})

const Print = mongoose.model('Print', printSchema)
module.exports = Print