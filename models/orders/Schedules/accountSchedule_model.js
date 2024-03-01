const mongoose = require('mongoose')
const { Schema } = mongoose

const accountScheduleSchema = new Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        details: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PreOrder'
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
        }
        ,
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

const AccountSchedule = mongoose.model('AccountSchedule', accountScheduleSchema)
module.exports = AccountSchedule