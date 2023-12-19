const mongoose = require('mongoose')
const {Schema} = mongoose

const embossSchema = new Schema({ 
    code: String,
    round: {
        start: Number,
        end: Number,
        join: String
    },
    option: [
        {
            plateSize: String,
            pumpPrice: Number
        }
    ]
})

const Emboss = mongoose.model('Emboss', embossSchema)
module.exports = Emboss