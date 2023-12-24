const Coating = require('../models/products/coating_model.js')

// add new coating type
exports.addCoating = async (req, res) => {
    const { type } = req.body
    try {
        const coating = await Coating.find()

        const code = `coat-${coating.length}`

        const new_coating = new Coating({
            code: code,
            method: type
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
    const { type } = req.params
    try {
       const coating = await Coating.findOne({type:type})
        if(!coating || coating.length===0){
            return res.send({
                message: 'ไม่พบสินค้าประเภทนี้',
                rawMatts: coating || []
            })
        }

        const subTypes = coating.option.map(option => option.subType)
        const unique_subTypes = new Set(subTypes)

        return res.send({
            subTypes: [...unique_subTypes],
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
    const { subType, avr, minPrice } = req.body

    try {
        const coating = await Coating.findByIdAndUpdate(id, {
            $push:{
                option: {
                    subType: subType,
                    avr: avr,
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

// delete option in Coating
exports.deleteCoatingOption = async (req, res) => {
    const {id, option} = req.params
    try {
        const coating = await Coating.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!coating){
            return res.send({
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

