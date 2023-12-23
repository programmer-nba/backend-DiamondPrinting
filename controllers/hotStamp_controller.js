const HotStamp = require('../models/products/hotStamp_model.js')

// add new hot-stamp
exports.addHotStamp = async (req, res) => {
    const { stamp_color, avr } = req.body
    try {
        const hotStamp = await HotStamp.find()
        const code = `stamp-${hotStamp.length}`

        const new_stamp = new HotStamp({
            code: code,
            stamp_color: stamp_color,
            avr: avr
        })
        const saved_stamp = await new_stamp.save()
        if(!saved_stamp) {
            return res.status(500).send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_stamp: saved_stamp
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_stamp
        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถเพิ่มสินค้าได้',
            err: err.message
        })
    }
}

// get all hot stamps
exports.getHotStamps = async (req, res) => {
    try {
        const hotStamps = await HotStamp.find()
        if(!hotStamps){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: hotStamps
            })
        } else if (hotStamps && hotStamps.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: hotStamps || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${hotStamps.length} รายการ`,
            success: true,
            products: hotStamps
        })
        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถดูสินค้าทั้งหมดได้',
            err: err.message
        })
    }
}

// get all hot stamp
exports.getHotStamp = async (req, res) => {
    const { id } = req.params
    try {
        const hotStamp = await HotStamp.findById(id)
        if(!hotStamp){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: hotStamp
            })
        }

        return res.send({
            success: true,
            products: hotStamp
        })
        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถดูสินค้าทั้งหมดได้',
            err: err.message
        })
    }
}

// edit hot stamp avr
exports.updateHotStamp = async (req, res) => {
    const { id } = req.params
    const { avr } = req.body

    try {
        const hotStamp = await HotStamp.findByIdAndUpdate(id, {
            $set:{
                avr: avr
            }
        },{new:true})
        if(!hotStamp) {
            return res.status(404).send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: hotStamp
        })

    }
    catch (err) {
        res.send({
            message: 'ไม่สามารถอัพเดทข้อมูลสินค้า',
            err: err.message
        })
        console.log(err.message)
    }
}

// delete hot stamp
exports.deleteHotStamp = async (req, res) => {
    const { id } = req.params
    try {
        const hotStamp = await HotStamp.findByIdAndDelete(id)
        if(!hotStamp){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ'
            })
        }

        return res.send({
            message: 'ลบ hot stamp สำเร็จ',
            success: true
        })
    }
    catch (err) {
        res.send({
            message: 'ไม่สามารถลบตัวเลือกของสินค้านี้',
            err: err.message
        })
        console.log(err.message)
    }
}