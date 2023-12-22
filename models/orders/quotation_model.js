const mongoose = require('mongoose')
const {Schema} = mongoose

const quotationSchema = new Schema(
    {
        code: String,
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
    },
    {
        timestamps: true
    }
)

const Quotation = mongoose.model('Quotation', quotationSchema)
module.exports = Quotation