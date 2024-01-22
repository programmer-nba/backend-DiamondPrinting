const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new Schema(
    {
        code: String,
        quotation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quotation'
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        details: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreOrder'
        },
        data: {
            price_type: String,
            amount: Number,
            cal_data: Array,
            cost_detail: Object,
            cost_total: Number,
            cost_ppu: Number,
            price: Object,
        },
        status: {
            name: String,
            text: String,
            sender: {
                name: String,
                _id: String,
                code: String
            },
            createAt: Date
        },
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order