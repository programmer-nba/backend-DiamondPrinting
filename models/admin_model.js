const mongoose = require('mongoose')
const { Schema } = mongoose

const adminSchema = new Schema({
    username: String,
    password: String,
    phone_number: String,
    email: String,
    role: {
        main: {
            type: String,
            default: 'admin'
        },
        sub: String,
    },
    code: String,
    logedInHis: [
        {
            time: Date,
            ip: String,
        }
    ],
})

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin