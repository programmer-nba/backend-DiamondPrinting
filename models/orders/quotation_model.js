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
        preOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreOrder'
        },
        price: [
            {
                order: Number,
                normal: {
                    total: Number,
                    unit: Number
                },
                special: {
                    total: Number,
                    unit: Number
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const Quotation = mongoose.model('Quotation', quotationSchema)
module.exports = Quotation