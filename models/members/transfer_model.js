const mongoose = require('mongoose')
const { Schema } = mongoose

const transferSchema = new Schema({
    name: {
        first: String,
        last: String,
    },
    username: String,
    password: String,
    phone_number: String,
    email: String,
    role: {
        main: String,
        sub: String,
    },
    code: String,
    logedInHis: [
        {
            time: Date,
            ip: String,
        }
    ],
    rank: String,
})

const Transfer = mongoose.model('Transfer', transferSchema)
module.exports = Transfer