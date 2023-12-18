const Plate = require('../models/products/plate_model.js')

// add new plate
exports.addPlate = async (req, res) => {
    const { size, price } = req.body
    try {
    
        const code = `plate-${size}`

        const new_plate = new Plate({
            code: code,
            size: size,
            price: price
        })
        const saved_plate = await new_plate.save()
        if(!saved_plate) {
            return res.status(500).send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_plate
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_plate
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

// get all plates
exports.getPlates = async (req, res) => {
    try {
        const plates = await Plate.find()
        if(!plates){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: plates
            })
        } else if (plates && plates.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: plates || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${plates.length} รายการ`,
            success: true,
            products: plates
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

// edit plate price
exports.updatePlatePrice = async (req, res) => {
    const { id } = req.params
    const { price } = req.body

    try {
        const plate = await Plate.findByIdAndUpdate(id, {
            $set:{
                price: price
            }
        },{new:true})
        if(!plate) {
            return res.status(404).send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: plate
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

// delete plate
exports.deletePlate = async (req, res) => {
    const { id } = req.params
    try {
        const plate = await Plate.findByIdAndDelete(id)
        if(!plate){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ'
            })
        }

        return res.send({
            message: 'ลบเพลทสำเร็จ',
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