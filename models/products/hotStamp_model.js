const mongoose = require('mongoose')
const {Schema} = mongoose

const hotStampSchema = new Schema({ 
    code: String,
    stamp_color: String, // สีทอง, สีเงิน, สีพิเศษ, โฮโลแกรม
    avr: Number, // ค่าเฉลี่ยสี
})

const HotStamp = mongoose.model('HotStamp', hotStampSchema)
module.exports = HotStamp