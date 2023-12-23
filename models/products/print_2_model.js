const mongoose = require('mongoose')
const {Schema} = mongoose

const print_2_Schema = new Schema({ 
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

const Print_2 = mongoose.model('Print_2', print_2_Schema)
module.exports = Print_2