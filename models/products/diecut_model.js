const mongoose = require('mongoose')
const {Schema} = mongoose

const diecutSchema = new Schema({ 
    code: String,
    round: {
        start: Number,
        end: Number,
        join: String
    },
    option: [
        {
            plateSize: String,
            pumpPrice: Number,
            blockPrice: Number,
        }
    ]
})

const Diecut = mongoose.model('Diecut', diecutSchema)
module.exports = Diecut