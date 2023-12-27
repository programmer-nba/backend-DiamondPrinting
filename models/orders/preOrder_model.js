const mongoose = require('mongoose')
const {Schema} = mongoose

const preOrderSchema = new Schema(
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
        name: String,
        brand: String,
        
        demensions: {
            width: Number,
            long: Number,
            height: Number
        },
       
        paper: {
            type: {
                type: String
            },
            subType: String
        },
        colors: {
            front: Number,
            front_pantone: String,
            floor: Boolean,
            back: Number,
            back_pantone: String,
        },
        coating: {
            method: {
                type: {
                    type: String
                },
                subType: String
            },
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
                long: Number
            }
        ],
        note: String,
        status: [
            {
                name: String,
                text: String,
                ref: String,
                sender: {
                    name: String,
                    code: String,
                    _id: mongoose.Schema.Types.ObjectId
                },
                createAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
)

const PreOrder = mongoose.model('PreOrder', preOrderSchema)
module.exports = PreOrder