const mongoose = require('mongoose')
const { Schema } = mongoose

const preProductionSchema = new Schema(
    {
        code: String,
        production: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Production',
            default: null
        },
        preOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreOrder'
        },
        rawMattData : {
            type : {
                type: String
            }, 
            subType: String,
            gsm: Number, 
            width: Number,
            long: Number,
            cut : Number,
            lay : Number
        },
        print_4_Data : {
            colors : [Number, Number], // from pre-order
            lay : Number
        },
        print_2_Data : {
            colors : [Number, Number], // from pre-order
            lay : Number
        },
        plateData : {
            colors : [Number, Number], // from pre-order
            size : String
        },
        coatingData : {
            method: {
                type: {
                    type: String
                },
                subType: String
            },
            width: Number, // from pre-order
            long: Number, // from pre-order
            cut: Number,  // from pre-order
            lay: Number // from pre-order
        },
        embossData : {
            demensions: [{
                inWidth: Number,
                inLong: Number,
                mark: String
            }],
            plateSize: String,
            lay: Number
        },
        hotStampData : {
            block : [
                {
                    inWidth: Number,
                    inLong: Number,
                    color: String,
                    mark: String
                }
            ],
            lay: Number,
            k: Number   
        }
    }
)

const PreProduction = mongoose.model('PreProduction', preProductionSchema)
module.exports = PreProduction