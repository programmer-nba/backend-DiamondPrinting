const mongoose = require('mongoose')
const { Schema } = mongoose

const preProductionSchema = new Schema(
    {
        code: String,
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        sale: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sale',
            default: null
        },
        production: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Production',
            default: null
        },
        preOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreOrder'
        },
        data_input: {
            width: Number,
            long: Number,
            cut: Number,
            lay: Number,
            plateSize: String,
            inWidth: Number,
            inLong: Number
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
            lay : Number,
            floor_front: Boolean,
            floor_back: Boolean,
            colors_uv: Boolean
        },
        print_2_Data : {
            colors : [Number, Number], // from pre-order
            lay : Number,
            floor_front: Boolean,
            floor_back: Boolean,
            colors_uv: Boolean
        },
        plateData : {
            colors : Number, // from pre-order
            size : String,
            flip_plate: Boolean
        },
        coatingData : {
            methods: Array,
            width: Number, // from pre-order
            inWidth: Number, // from pre-order
            long: Number, // from pre-order
            inLong: Number, // from pre-order
            cut: Number,  // from pre-order
            lay: Number // from pre-order
        },
        coatingBackData : {
            methods: Array,
            width: Number, // from pre-order
            inWidth: Number, // from pre-order
            long: Number, // from pre-order
            inLong: Number, // from pre-order
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
            k: {
                type: Number,
                default: 1
            }   
        },
        diecutData : {
            plateSize: String,
            lay: Number
        },
        diecutWindowData : {
            plateSize: String,
            lay: Number
        },
        diecutBlowData: Boolean,
        glueData : {
            glue: Array,
            glue2: Array,
            glue_dot: Array
        },
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
        down: Number
    }
)

const PreProduction = mongoose.model('PreProduction', preProductionSchema)
module.exports = PreProduction