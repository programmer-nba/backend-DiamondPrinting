const mongoose = require('mongoose')
const { Schema } = mongoose

const customerSchema = new Schema(
    {
        code: String,
        nameTh: String,
        nameEng: String,
        address: {
            houseNo: String,
            province: String,
            district: String,
            subdistrict: String,
            street: String,
            postcode: String
        },
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