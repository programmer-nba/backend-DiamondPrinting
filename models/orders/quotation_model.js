const mongoose = require('mongoose')
const {Schema} = mongoose

const quotationSchema = new Schema(
    {
        code: String,
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        sale: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sale'
        },
        details: {
            
        }
    },
    {
        timestamps: true
    }
)

const Quotation = mongoose.model('Quotation', quotationSchema)
module.exports = Quotation