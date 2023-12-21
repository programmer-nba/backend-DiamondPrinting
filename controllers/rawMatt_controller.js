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

// get rawMatt types&&subTypes
exports.getRawMattTypes = async (req, res) => {
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

        const type = rawMatts.map(m => m.type)
        const uniqueType = new Set(type)
        const subType = rawMatts.map(m => m.subType) 
        const uniqueSubType = new Set(subType)

        return res.send({
            success: true,
            rawMatt_types: [...uniqueType],
            rawMatt_subTypes: [...uniqueSubType],
            success: true
        })
        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถดูประเภทได้',
            err: err.message
        })
    }
}

// get rawMatt options
exports.getRawMattOptions = async (req, res) => {
    const { type, subType } = req.body
    
    try {
       const rawMatts = await RawMatt.findOne({ type: type , subType: subType })
        if(!rawMatts || rawMatts.length===0){
            return res.status(404).send({
                message: 'ไม่พบสินค้าประเภทนี้',
                rawMatts: rawMatts || []
            })
        }

        const gsms = rawMatts.option.map(option => option.gsm)
        const unique_gsm = new Set(gsms)
        const widths = rawMatts.option.map(option => option.width)
        const unique_width = new Set(widths)
        const longs = rawMatts.option.map(option => option.long)
        const unique_long = new Set(longs)

        return res.send({
            gsm: [...unique_gsm],
            width: [...unique_width],
            long: [...unique_long],
            success: true
        })

        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถดูตัวเลือกได้',
            err: err.message
        })
    }
}

// edit RawMatt option
exports.updateRawMattOption = async (req, res) => {
    const { id } = req.params
    const { option } = req.body //gsm, width, long, pkg
    console.log(option)
    let rawMatt_list = []
    try {
        for(item of option) {
            console.log(item)
            console.log(item.gsm)
            const psheet = Math.ceil((item.gsm*item.width*item.long*item.pkg/3100)/500)
            const rawMatt = await RawMatt.findByIdAndUpdate(id, {
                $push:{
                    option: {
                        gsm: item.gsm,
                        width: item.width,
                        long: item.long,
                        pkg: item.pkg,
                        psheet: psheet
                    },
                }
            },{new:true})
            if(!rawMatt) {
                return res.status(404).send({
                    message: 'ไม่พบสินค้านี้ในระบบ',
                })
            }
            rawMatt_list.push(rawMatt)
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: rawMatt_list
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

// delete Rawmatt
exports.deleteRawMatt = async (req, res) => {
    const {id} = req.params
    try {
        const rawMatt = await RawMatt.findByIdAndDelete(id)
        if(!rawMatt){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ'
            })
        }

        return res.send({
            message: 'ลบสำเร็จ',
            success: true
        })
    }
    catch (err) {
        res.send({
            message: 'ไม่สามารถลบสินค้านี้',
            err: err.message
        })
        console.log(err.message)
    }
}