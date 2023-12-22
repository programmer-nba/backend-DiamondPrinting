const mongoose = require('mongoose')
const {Schema} = mongoose

const preOrderSchema = new Schema(
    { 
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        sale: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sale'
        },
        order: {
            amount: Number,
            demensions: {
                width: Number,
                long: Number,
                height: Number
            }
        },
        paper: {
            type: {
                type: String
            },
            subType: String
        },
        colors: {
            front: Number,
            back: Number
        },
        //pantone: [{type:String}],
        coating: {
            method: String,
            spotUv: Boolean,
            dipOff: Boolean
        },
        hotStamp: [
            {
                inWidth: Number,
                inLong: Number,
                color: String,
                mark: String
            }
        ],
        emboss: [
            {
                inWidth: Number,
                inLong: Number,
                mark: String
            }   
        ],
        dieCut: String,
        glue: [
            {
                mark: String,
                width: Number,
                long: Number
            }
        ],
        note: String,
    },
    {
        timestamps: true
    }
)

const PreOrder = mongoose.model('PreOrder', preOrderSchema)
module.exports = PreOrder