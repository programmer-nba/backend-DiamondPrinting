const mongoose = require('mongoose')
const { Schema } = mongoose

const purchaseScheduleSchema = new Schema(
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
        remark: String,
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

const PurchaseSchedule = mongoose.model('PurchaseSchedule', purchaseScheduleSchema)
module.exports = PurchaseSchedule