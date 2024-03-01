const mongoose = require('mongoose')
const { Schema } = mongoose

const plaingScheduleSchema = new Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        details: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreOrder'
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
        purchase: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PurchaseSchedule',
            default: null
        },
        production: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductionSchedule',
            default: null
        },
        qc: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QCSchedule',
            default: null
        },
        transfer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TransferSchedule',
            default: null
        },
    },
    {
        timestamps: true
    }
)

const PlaningSchedule = mongoose.model('PlaningSchedule', plaingScheduleSchema)
module.exports = PlaningSchedule