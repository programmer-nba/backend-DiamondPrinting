const Coating = require('../models/products/coating_model.js')

// add new coating type
exports.addCoating = async (req, res) => {
    const { type } = req.body
    try {
        const coating = await Coating.find()

        const code = `coat-${coating.length}`

        const new_coating = new Coating({
            code: code,
            type: type
        })
        const saved_coating = await new_coating.save()
        if(!saved_coating) {
            return res.send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_coating
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_coating
        })
    }
    catch (err) {
        console.log(err.message)
        res.send({
            message: 'ไม่สามารถเพิ่มสินค้าได้',
            err: err.message
        })
    }
}

// get all coatings
exports.getCoatings = async (req, res) => {
    try {
        const coatings = await Coating.find()
        if(!coatings){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: coatings
            })
        } else if (coatings && coatings.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: coatings || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${coatings.length} รายการ`,
            success: true,
            products: coatings
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

// get coating types
exports.getCoatingTypes = async (req, res) => {
    try {
        const coatings = await Coating.find()
        if(!coatings){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: coatings
            })
        } else if (coatings && coatings.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: coatings || [],
                success: true
            })
        }

        const type = coatings.map(m => m.type)
        const uniqueType = new Set(type)

        return res.send({
            success: true,
            coating_types: [...uniqueType]
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

// get coating options
exports.getCoatingOptions = async (req, res) => {
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

// edit Coating option
exports.updateCoatingOption = async (req, res) => {
    const { id } = req.params
    const { width, long, avr, minPrice } = req.body

    const unit = 'in'

    try {
        const coating = await Coating.findByIdAndUpdate(id, {
            $push:{
                option: {
                    width: width,
                    long: long,
                    avr: avr,
                    unit: unit,
                    minPrice: minPrice
                },
            }
        },{new:true})
        if(!coating) {
            return res.send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: coating
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