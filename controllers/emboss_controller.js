const Emboss = require('../models/products/emboss_model.js')

// add new emboss
exports.addEmboss = async (req, res) => {
    const { start, end } = req.body
    try {
        const emboss = await Emboss.find()
        const code = `emboss-${emboss.length}`

        const new_emboss = new Emboss({
            code: code,
            round: {
                start: start,
                end: end,
                join: `${start.toLocaleString()}-${end.toLocaleString()}`,
            }
        })
        const saved_emboss = await new_emboss.save()
        if(!saved_emboss) {
            return res.send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_emboss
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_emboss
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

// get all embosses
exports.getEmbosses = async (req, res) => {
    try {
        const embosses = await Emboss.find()
        if(!embosses){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: embosses
            })
        } else if (embosses && embosses.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: embosses || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${embosses.length} รายการ`,
            success: true,
            products: embosses
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

// edit emboss option
exports.updateEmbossOption = async (req, res) => {
    const { id } = req.params
    const { pumpPrice, plateSize } = req.body
    console.log(req.body)

    try {
        const emboss = await Emboss.findByIdAndUpdate(id, {
            $push:{
                option: {
                    plateSize: plateSize,
                    pumpPrice: pumpPrice
                }
            }
        },{new:true})
        if(!emboss) {
            return res.send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: emboss
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

// delete emboss
exports.deleteEmboss = async (req, res) => {
    const { id } = req.params
    try {
        const emboss = await Emboss.findByIdAndDelete(id)
        if(!emboss){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ'
            })
        }

        return res.send({
            message: 'ลบ emboss สำเร็จ',
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

// delete option in Emboss
exports.deleteEmbossOption = async (req, res) => {
    const {id, option} = req.params
    try {
        const emboss = await Emboss.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!emboss){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ'
            })
        }

        return res.send({
            message: 'ลบตัวเลือกสำเร็จ',
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