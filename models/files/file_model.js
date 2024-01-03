const mongoose = require('mongoose')
const {Schema} = mongoose

const fileSchema = new Schema(
    { 
        fileName: String,
        code: String,
        fileId: String,
        fileType: String,
        sender: {
            _id: String,
            name: String,
            role: String,
            code: String
        },
        preOrderId: String
    },
    {
        timestamps: true
    }
)

const File = mongoose.model('File', fileSchema)
module.exports = File