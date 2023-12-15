const mongoose = require('mongoose')
const { Schema } = mongoose

const productionSchema = new Schema({
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
        sub: String, // graphic, qc
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

const Production = mongoose.model('Production', productionSchema)
module.exports = Production