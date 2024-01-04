const Print_4 = require('../models/products/print_4_model.js')

// add new print color
exports.addPrint_4_Color = async (req, res) => {
    const { colors } = req.body
    try {
    
        const code = `print-4-${colors}`

        const new_print_4 = new Print_4({
            code: code,
            colors: parseInt(colors),
        })
        const saved_print_4 = await new_print_4.save()
        if(!saved_print_4) {
            return res.send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_print_4
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_print_4
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

// edit print color
exports.editPrint_4_Color = async (req, res) => {
    const { id } = req.params
    const { colors } = req.body
    try {

        const print_4 = await Print_4.findByIdAndUpdate(id,{
            $set: {
                colors: colors
            }
        }, { new: true })
        if(!print_4) {
            return res.send({
                message: 'ไม่สามารถบันทึกสินค้า',
                print_4: print_4
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            print_4: print_4
        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถแก้ไขสินค้าได้',
            err: err.message
        })
    }
}

// get print-4 options
exports.getPrint_4_Options = async (req, res) => {
    const { color } = req.params
    
    try {
       const print4 = await Print_4.findOne({ colors: color })
        if(!print4 || print4.length===0){
            return res.send({
                message: 'ไม่พบสินค้าประเภทนี้',
                rawMatts: print4 || []
            })
        }

        const round = print4.option.map(option => option.round.join)
        const unique_round = new Set(round)
    
        return res.send({
            round: [...unique_round],
            success: true,
            color: color
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

// get all print colors
exports.getPrint_4_Colors = async (req, res) => {
    try {
        const prints_4 = await Print_4.find()
        if(!prints_4){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prints_4
            })
        } else if (prints_4 && prints_4.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: prints_4 || [],
                success: true
            })
        }

        const allColors = prints_4.map(p=>p.colors)

        return res.send({
            title: `เครื่องปริ้นท์ตัด 4`,
            success: true,
            colors: allColors.sort((a, b) => {
                if (a === 10) return 1
                if (b === 10) return -1
                return a - b
            })
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

// edit print price
exports.editPrint_4_Option = async (req, res) => {
    const { id, option } = req.params
    const { start, end, price } = req.body //start, end, price
    
    try {
        
        const print_4 = await Print_4.updateOne(
            { _id: id, 'option._id': option },
            {
                $set: {
                    'option.$.round.start' : start,
                    'option.$.round.end' : end,
                    'option.$.round.join' : `${start}-${end}`,
                    'option.$.price' : price
                }
            }
        )
        if(!print_4) {
            return res.status(404).send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }       

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
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

// add print price
exports.addPrint_4_Option = async (req, res) => {
    const { id } = req.params
    const { option } = req.body //start, end, price
    let print_4_list = []
    try {
        for (item of option) {
            const print_4 = await Print_4.findByIdAndUpdate(id, {
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
            if(!print_4) {
                return res.send({
                    message: 'ไม่พบสินค้านี้ในระบบ',
                })
            }
            print_4_list.push(print_4)
        }
        

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: print_4_list
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
exports.getPrints_4 = async (req, res) => {
    try {
        const prints_4 = await Print_4.find()
        if(!prints_4){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prints_4
            })
        } else if (prints_4 && prints_4.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: prints_4 || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${prints_4.length} รายการ`,
            success: true,
            products: prints_4
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
exports.getPrint_4 = async (req, res) => {
    const { id } = req.params
    try {
        const print_4 = await Print_4.findById(id)
        if(!print_4){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: print_4
            })
        } else if (print_4 && print_4.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: print_4 || [],
                success: true
            })
        }

        return res.send({
            success: true,
            products: print_4
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
exports.deletePrint_4 = async (req, res) => {
    const { id } = req.params
    try {
        const print_4 = await Print_4.findByIdAndDelete(id)
        if(!print_4){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: print_4
            })
        } else if (print_4 && print_4.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: print_4 || [],
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
exports.deletePrint_4_Option = async (req, res) => {
    const {id, option} = req.params
    try {
        const print_4 = await Print_4.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!print_4){
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