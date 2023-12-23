const Print_2 = require('../models/products/print_2_model.js')

// add new print color
exports.addPrint_2_Color = async (req, res) => {
    const { colors } = req.body
    try {
    
        const code = `print-2-${colors}`

        const new_print_2 = new Print_2({
            code: code,
            colors: parseInt(colors),
        })
        const saved_print_2 = await new_print_2.save()
        if(!saved_print_2) {
            return res.status(500).send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_print_2
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_print_2
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
exports.getPrint_2_Colors = async (req, res) => {
    try {
        const prints_2 = await Print_2.find()
        if(!prints_2){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prints_2
            })
        } else if (prints_2 && prints_2.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: prints_2 || [],
                success: true
            })
        }

        const allColors = prints_2.map(p=>p.colors)

        return res.send({
            message: `มีจำนวณสีทั้งหมด ${prints_2.length} รายการ`,
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
exports.updatePrint_2_Option = async (req, res) => {
    const { id } = req.params
    const { option } = req.body //start, end, price
    let print_2_list = []
    try {
        for (item of option) {
            const print_2 = await Print_2.findByIdAndUpdate(id, {
                $push:{
                    option: {
                        round: {
                            start: item.start,
                            end: item.end,
                            join: `${parseInt(item.start).toLocaleString()}-${parseInt(item.end).toLocaleString()}`
                        },
                        price: parseFloat(item.price)
                    }
                },
            },{new:true})
            if(!print_2) {
                return res.status(404).send({
                    message: 'ไม่พบสินค้านี้ในระบบ',
                })
            }
            print_2_list.push(print_2)
        }
        

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: print_2_list
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
exports.getPrints_2 = async (req, res) => {
    try {
        const prints_2 = await Print_2.find()
        if(!prints_2){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prints_2
            })
        } else if (prints_2 && prints_2.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: prints_2 || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${prints_2.length} รายการ`,
            success: true,
            products: prints_2
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
exports.getPrint_2 = async (req, res) => {
    const { id } = req.params
    try {
        const print_2 = await Print_2.findById(id)
        if(!print_2){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: print_2
            })
        } else if (print_2 && print_2.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: print_2 || [],
                success: true
            })
        }

        return res.send({
            success: true,
            products: print_2
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
exports.deletePrint_2 = async (req, res) => {
    const { id } = req.params
    try {
        const print_2 = await Print_2.findByIdAndDelete(id)
        if(!print_2){
            return res.status(404).send({
                message: 'ไม่พบสินค้าในระบบ',
                products: print_2
            })
        } else if (print_2 && print_2.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: print_2 || [],
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
exports.deletePrint_2_Option = async (req, res) => {
    const {id, option} = req.params
    try {
        const print_2 = await Print_2.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!print_2){
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