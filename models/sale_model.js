const mongoose = require('mongoose')
const { Schema } = mongoose

const saleSchema = new Schema({
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

const Sale = mongoose.model('Sale', saleSchema)
module.exports = Sale