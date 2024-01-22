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
        start: String,
        expire: String,
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
        ],
        status: [
            {
                name: String,
                text: String,
                sender: {
                    name: String,
                    code: String,
                    _id: mongoose.Schema.Types.ObjectId
                },
                createAt: Date
            }
        ],
        approve: Boolean,
        reject: {
            status: Boolean,
            remark: String
        },
        calDetails: Array
    },
    {
        timestamps: true
    }
)

const Quotation = mongoose.model('Quotation', quotationSchema)
module.exports = Quotation