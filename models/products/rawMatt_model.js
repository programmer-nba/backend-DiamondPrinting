const mongoose = require('mongoose')
const {Schema} = mongoose

const rawMattSchema = new Schema({ 
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

const RawMatt = mongoose.model('RawMatt', rawMattSchema)
module.exports = RawMatt