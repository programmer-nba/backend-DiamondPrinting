const mongoose = require('mongoose')
const { Schema } = mongoose

const profitSchema = new Schema({
    title: { type: String, required: true, unique: true },
    percent: { type: Number, required: true, unique: true },
})

const Profit = mongoose.model('Profit', profitSchema)
module.exports = Profit