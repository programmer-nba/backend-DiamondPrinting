const RawMatt = require('../models/products/rawMatt_model.js')

// add new rawMatt
exports.addRawMatt = async (req, res) => {
    const { type, subType } = req.body
    try {
        const rawMatt = await RawMatt.find()

        const code = `${rawMatt.length}`

        const new_rawMatt = new RawMatt({
            code: code,
            type: type,
            subType: subType
        })
        const saved_rawMatt = await new_rawMatt.save()
        if(!saved_rawMatt) {
            return res.status(500).send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_rawMatt
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_rawMatt
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

// get all rawMatts
exports.getRawMatts = async (req, res) => {
    try {
        const rawMatts = await RawMatt.find()
        if(!rawMatts){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: rawMatts
            })
        } else if (rawMatts && rawMatts.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: rawMatts || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${rawMatts.length} รายการ`,
            success: true,
            products: rawMatts
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

// edit RawMatt option
exports.updateRawMattOption = async (req, res) => {
    const { id } = req.params
    const { gsm, width, long, pkg } = req.body

    const psheet = Math.ceil((gsm*width*long*pkg/3100)/500)

    try {
        const rawMatt = await RawMatt.findByIdAndUpdate(id, {
            $push:{
                option: {
                    gsm: gsm,
                    width: width,
                    long: long,
                    pkg: pkg,

                    psheet: psheet
                },
            }
        },{new:true})
        if(!rawMatt) {
            return res.status(404).send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: rawMatt
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

// delete option in Rawmatt
exports.deleteRawMattOption = async (req, res) => {
    const {id, option} = req.params
    try {
        const rawMatt = await RawMatt.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!rawMatt){
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