const mongoose = require('mongoose')
const { Schema } = mongoose

const purchaseSchema = new Schema({
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

const Purchase = mongoose.model('Purchase', purchaseSchema)
module.exports = Purchase