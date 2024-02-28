const mongoose = require('mongoose')
const { Schema } = mongoose

const productionScheduleSchema = new Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        planingSchedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PlaningSchedule'
        },
        start_time: {
            type: Date
        },
        end_time: {
            type: Date
        },
        progress: {
            status: String,
            percent: Number
        },
        remark: {
            name: String,
            createAt: Date
        },
        status: [
            {
                name: String,
                text: String,
                detail: String,
                sender: {
                    name: String,
                    _id: String,
                    code: String
                },
                createAt: Date
            }
        ],
    },
    {
        timestamps: true
    }
)

const ProductionSchedule = mongoose.model('ProductionSchedule', productionScheduleSchema)
module.exports = ProductionSchedule