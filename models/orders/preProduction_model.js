const mongoose = require('mongoose')
const { Schema } = mongoose

const preProductionSchema = new Schema(
    {
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
            order : Number, // from pre-order
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
        plateData : {
            colors : [Number, Number], // from pre-order
            size : String
        },
        printData : {
            colors : [Number, Number], // from pre-order
            order : Number, // from pre-order
            lay : Number
        }
    }
)

const PreProduction = mongoose.model('PreProduction', preProductionSchema)
module.exports = PreProduction