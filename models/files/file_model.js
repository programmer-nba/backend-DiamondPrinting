const mongoose = require('mongoose')
const {Schema} = mongoose

const fileSchema = new Schema(
    { 
        name: String,
        code: String,
        fileId: String
    },
    {
        timestamps: true
    }
)

const File = mongoose.model('File', fileSchema)
module.exports = File