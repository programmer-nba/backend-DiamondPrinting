const mongoose = require('mongoose')
const {Schema} = mongoose

const print_4_Schema = new Schema({ 
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

const Print_4 = mongoose.model('Print_4', print_4_Schema)
module.exports = Print_4