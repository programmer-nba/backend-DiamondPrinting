const mongoose = require('mongoose')
const {Schema} = mongoose

const orderSchema = new Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        sale: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sale'
        },
        production: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Production'
        },
        details: {
            amount: Number,
            brand: String,
            name: String,
            width: Number,
            long: Number,
            height: Number
        },
        matterials: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreProduction'
        },
        cost: {
            
        }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order