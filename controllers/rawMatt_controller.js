const RawMatt = require('../models/products/rawMatt_model.js')

// add new rawMatt
exports.addRawMatt = async (req, res) => {
    const { type, subType } = req.body
    try {
        const rawMatt = await RawMatt.find()

        const code = `${rawMatt.length}`

        const new_rawMatt = new RawMatt({
            code: code,
            type: type.trim(),
            subType: subType.trim()
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

// get rawMatt
exports.getRawMatt = async (req, res) => {
    const { id } = req.params
    try {
        const rawMatt = await RawMatt.findById(id)
        if(!rawMatt){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: rawMatt
            })
        }

        return res.send({
            success: true,
            products: rawMatt
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

// edit rawMatt type
exports.editRawMattType = async (req, res) => {
    const { id } = req.params
    const { type, subType } = req.body
    try {
        const prev_rawMatt = await RawMatt.findById(id)
        if(!prev_rawMatt){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prev_rawMatt
            })
        }
        const rawMatt = await RawMatt.findByIdAndUpdate(id, {
            $set: {
                type: (type && type!==null || type && type.trim()!=='') ? type : prev_rawMatt.type,
                subType: (subType && subType!==null || subType && subType.trim()!=='') ? subType : prev_rawMatt.subType
            }
        }, {new:true})
        

        return res.send({
            success: true,
            products: rawMatt
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

// edit rawMatt option
exports.editRawMattOption = async (req, res) => {
    const { id, option } = req.params
    const { gsm, width, long, pkg } = req.body
    try {
        const prev_rawMatt = await RawMatt.findById(id)
        if(!prev_rawMatt){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prev_rawMatt
            })
        }
        
        const psheet = Math.ceil((parseInt(gsm)*parseInt(width)*parseInt(long)*parseInt(pkg)/3100)/500) 
        const rawMatt = await RawMatt.updateOne(
            { _id: id, 'option._id': option },
            {
                $set: {
                    'option.$.gsm' : gsm,
                    'option.$.width' : width,
                    'option.$.long' : long,
                    'option.$.pkg' : pkg,
                    'option.$.psheet' : psheet
                }
            },
            { new : true }
        )
        if(!rawMatt){
            return res.send({
                message: 'ไม่พบ id ของ option นี้',
                rawMatt: rawMatt
            })
        }
        

        return res.send({
            success: true,
            message: 'update success'
        })
        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถอัพเดทรายการ option นี้ได้',
            req: req.body,
            err: err.message
        })
    }
}

// get rawMatt types
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

        return res.send({
            success: true,
            rawMatt_types: [...uniqueType],
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

// get rawMatt sub-types
exports.getRawMattSubTypes = async (req, res) => {
    const { type } = req.params
    try {
        const rawMatts = await RawMatt.find({
            type: type
        })
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

        const subType = rawMatts.map(m => m.subType)
        const uniquesubType = new Set(subType)

        return res.send({
            success: true,
            subTypes: [...uniquesubType],
            type: type
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

// get rawMatt options (gsm)
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
            //width: [...unique_width],
            //long: [...unique_long],
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

// get rawMatt options (width)
exports.getRawMattWidths = async (req, res) => {
    const { type, subType, gsm } = req.body
    
    try {
       const rawMatts = await RawMatt.findOne({ type: type , subType: subType })
        if(!rawMatts || rawMatts.length===0){
            return res.status(404).send({
                message: 'ไม่พบสินค้าประเภทนี้',
                rawMatts: rawMatts || []
            })
        }

        const options = rawMatts.option.filter(fil=>fil.gsm === gsm)
        console.log(options)
        const widths = options.map(i => i.width)
        const unique_width = new Set(widths)
        //const longs = rawMatts.option.map(option => option.long)
        //const unique_long = new Set(longs)

        return res.send({
            //gsm: [...unique_gsm],
            width: [...unique_width],
            //long: [...unique_long],
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

exports.getRawMattLongs = async (req, res) => {
    const { type, subType, gsm, width } = req.body
    
    try {
       const rawMatts = await RawMatt.findOne({ type: type , subType: subType })
        if(!rawMatts || rawMatts.length===0){
            return res.status(404).send({
                message: 'ไม่พบสินค้าประเภทนี้',
                rawMatts: rawMatts || []
            })
        }

        const options = rawMatts.option.filter(fil=>fil.gsm === gsm && fil.width === width)

        //const widths = option.option.map(option => option.width)
        //const unique_width = new Set(widths)
        const longs = options.map(option => option.long)
        const unique_long = new Set(longs)

        return res.send({
            //gsm: [...unique_gsm],
            //width: [...unique_width],
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

// add RawMatt option
exports.addRawMattOption = async (req, res) => {
    const { id } = req.params
    const { option } = req.body //gsm, width, long, pkg
    let rawMatt_list = []
    try {
        for(item of option) {
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