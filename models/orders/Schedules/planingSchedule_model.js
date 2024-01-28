const mongoose = require('mongoose')
const { Schema } = mongoose

const plaingScheduleSchema = new Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
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

const PlaningSchedule = mongoose.model('PlaningSchedule', plaingScheduleSchema)
module.exports = PlaningSchedule