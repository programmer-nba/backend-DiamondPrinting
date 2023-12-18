const Print = require('../models/products/print_model.js')

// add new print color
exports.addPrintColor = async (req, res) => {
    const { colors } = req.body
    try {
    
        const code = `print-${colors}`

        const new_print = new Print({
            code: code,
            colors: parseInt(colors),
        })
        const saved_print = await new_print.save()
        if(!saved_print) {
            return res.status(500).send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_print
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_print
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

// get all print colors
exports.getPrintColors = async (req, res) => {
    try {
        const prints = await Print.find()
        if(!prints){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prints
            })
        } else if (prints && prints.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: prints || [],
                success: true
            })
        }

        const allColors = prints.map(p=>p.colors)

        return res.send({
            message: `มีจำนวณสีทั้งหมด ${prints.length} รายการ`,
            success: true,
            colors: allColors
        })
        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถดูสีทั้งหมดได้',
            err: err.message
        })
    }
}

// edit plate price
exports.updatePrintOption = async (req, res) => {
    const { id } = req.params
    const { start, end, price } = req.body

    try {
        const print = await Print.findByIdAndUpdate(id, {
            $push:{
                option: {
                    round: {
                        start: start,
                        end: end,
                        join: `${parseInt(start).toLocaleString()}-${parseInt(end).toLocaleString()}`
                    },
                    price: parseInt(price)
                }
            },
        },{new:true})
        if(!print) {
            return res.status(404).send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: print
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

// get all prints
exports.getPrints = async (req, res) => {
    try {
        const prints = await Print.find()
        if(!prints){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prints
            })
        } else if (prints && prints.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: prints || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${prints.length} รายการ`,
            success: true,
            products: prints
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

// get print
exports.getPrint = async (req, res) => {
    const { id } = req.params
    try {
        const print = await Print.findById(id)
        if(!print){
            return res.status(404).send({
                message: 'ไม่พบสินค้าในระบบ',
                products: print
            })
        } else if (print && print.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: print || [],
                success: true
            })
        }

        return res.send({
            success: true,
            products: print
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

// delete print
exports.deletePrint = async (req, res) => {
    const { id } = req.params
    try {
        const print = await Print.findByIdAndDelete(id)
        if(!print){
            return res.status(404).send({
                message: 'ไม่พบสินค้าในระบบ',
                products: print
            })
        } else if (print && print.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: print || [],
                success: true
            })
        }

        return res.send({
            success: true,
            message: 'ลบ print สำเร็จ'
        })
        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถลบ print ได้',
            err: err.message
        })
    }
}

// delete option in Print
exports.deletePrintOption = async (req, res) => {
    const {id, option} = req.params
    try {
        const print = await Print.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!print){
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