const mongoose = require('mongoose')
const { Schema } = mongoose

const customerSchema = new Schema(
    {
        nameTh: String,
        nameEng: String,
        address: String,
        taxID: String,
        contact: [
            {
                name: String,
                tel: String,
                createAt: Date
            }
        ],
        order: [
            {
                quotationID: mongoose.Schema.Types.ObjectId,
                createAt: Date
            }
        ]
    },
    {
        timestamps: true
    }
)

const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer