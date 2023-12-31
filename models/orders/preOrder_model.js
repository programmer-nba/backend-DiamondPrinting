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
        flip_plate: Boolean,
        paper: {
            type: {
                type: String
            },
            subType: String,
            gsm: Number
        },
        colors: {
            front_type: String,
            front: Number,
            front_pantone: String,
            floor_front: Boolean,
            back_type: String,
            back: Number,
            back_pantone: String,
            floor_back: Boolean
        },
        coating: [
            {
                method: {
                    type: {
                        type: String
                    },
                    subType: String
                },
                mark: String
            }
        ],
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
        dieCut: {
            percent: String,
            notice: String,
            detail: {
                type: String,
                default: '-' // ปรุ, หน้าต่าง
            }
        },
        glue: [
            {
                mark: String,
                long: Number
            }
        ],
        glue2: [
            {
                mark: String,
                width: Number,
                long: Number,
                price: Number,
                notice: String
            }
        ],
        glue_dot: [
            {
                type: String
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